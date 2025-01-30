from datetime import datetime, timezone

from flask import Blueprint, current_app, json, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy.exc import SQLAlchemyError

from app.models import Recipe, RecipeImage, db
from app.forms import ImageForm
from app.api.s3_helpers import upload_file_to_s3, get_unique_filename
# from app.utils.aws_s3 import upload_file_to_s3

recipe_images_routes = Blueprint('recipe_images', __name__)


@recipe_images_routes.route('/', methods=["GET"])
def all_images():
    """
    Query for all recipe images and return them in a list of image dictionaries.
    """

    try:
        recipe_images = RecipeImage.query.all()
        return {'recipe_images': [image.to_dict() for image in recipe_images]}

    except SQLAlchemyError as e:
        # Database debugging line
        current_app.logger.error(f"Database query error: {str(e)}")
        return jsonify({
            'message': 'An error occurred while fetching recipes. Please try again later.'
        }), 500

    except Exception as e:
        # Server debugging line
        current_app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500


@recipe_images_routes.route('/recipes/<int:recipe_id>', methods=['GET'])
@login_required
def get_recipe_images(recipe_id):
    """
    Query and return all images for a specific recipe.
    """
    recipe = Recipe.query.get(recipe_id)

    # Validate recipe existence
    if not recipe:
        return jsonify({"error": "Recipe not found"}), 404

    recipe_images = RecipeImage.query.filter_by(recipe_id=recipe_id).all()

    if not recipe_images:
        return jsonify({"message": "No images found for this recipe"}), 404

    return jsonify({
        "recipe_id": recipe_id,
        "recipe_images": [image.to_dict() for image in recipe_images]  # Include image data (with ID)
    }), 200

@recipe_images_routes.route("/new", methods=["POST"])
@login_required
def upload_recipe_image():
    """
    Endpoint to upload one or multiple recipe images to S3 and save the image URLs in the database.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    files = request.files.getlist('file')
    if not files or len(files) == 0:
        return jsonify({"error": "No files selected"}), 400

    image_urls = []
    new_images = []

    try:
        for file in files:
            s3_result = upload_file_to_s3(file)  # Upload each file to S3
            print("S3 RESULT (type & value) =====>", type(s3_result), s3_result)

            if not s3_result or not isinstance(s3_result, dict) or 'url' not in s3_result:
                print("UPLOAD ERROR: s3_result is missing 'url' or is not a dictionary")
                return jsonify({"error": "Failed to upload"}), 500


            image_url = s3_result['url']  # Extract the URL string
            print("IMAGE URL RESULT =====>", image_url)


            image_urls.append(image_url)

            # Create a new RecipeImage instance
            new_image = RecipeImage(
                image_url=image_url ,
                recipe_id=request.form.get('recipe_id'),
                user_id=current_user.id,
                uploaded_at=datetime.now(timezone.utc)
            )
            new_images.append(new_image)  # Collect instances

        # Add all instances to the session
        try:
            db.session.add_all(new_images)
            db.session.commit()
            print("DB COMMIT SUCCESS")
        except Exception as e:
            db.session.rollback()
            print("DB COMMIT ERROR:", str(e))
            return jsonify({'error': str(e)}), 500


        return jsonify({
            "message": "Recipe images uploaded successfully!",
            "image_urls": image_urls,
            "recipe_images": [image.to_dict() for image in new_images]
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@recipe_images_routes.route('/recipe/<int:recipe_id>/set-preview', methods=['POST'])
def set_preview_image(recipe_id):
    """Update the preview image for a recipe."""

    print(recipe_id)
    try:
        data = request.get_json()

        new_preview_image_id = data.get('image_id')

        if not new_preview_image_id:
            return jsonify({'message': 'Image ID is required'}), 400

        # Fetch current preview image
        current_preview_image = RecipeImage.query.filter_by(recipe_id=recipe_id, is_preview=True).first()
        if current_preview_image:
            current_preview_image.is_preview = False

        # Set new preview image
        new_preview_image = RecipeImage.query.filter_by(id=new_preview_image_id, recipe_id=recipe_id).first()
        if not new_preview_image:
            return jsonify({'message': 'Image not found'}), 404

        new_preview_image.is_preview = True

        db.session.commit()
        return jsonify({'message': 'Preview image updated successfully'})

    except SQLAlchemyError as e:
        db.session.rollback()
        current_app.logger.error(f"Database update error: {str(e)}")
        return jsonify({'message': 'An error occurred while updating the preview image.'}), 500

@recipe_images_routes.route('/<int:image_id>', methods=['DELETE'])
@login_required
def delete_recipe_image(image_id):
    """
    Delete an existing recipe image (only by the recipe owner).
    """
    recipe_image = RecipeImage.query.get(image_id)

    # Validate image existence
    if not recipe_image:
        return jsonify({'message': 'Recipe image not found'}), 404

    # Validate recipe existence
    recipe = Recipe.query.get(recipe_image.recipe_id)
    if not recipe:
        return jsonify({'message': 'Recipe not found'}), 404

    # Check if the current user is the recipe owner
    if recipe.owner_id != current_user.id:
        return jsonify({'message': 'You are not authorized to delete this image. Only the recipe owner can perform this action.'}), 403

    try:
        db.session.delete(recipe_image)
        db.session.commit()

        return jsonify({'message': 'Recipe image deleted successfully!'}), 200

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error deleting recipe image: {str(e)}")
        return jsonify({'message': 'Failed to delete recipe image', 'error': str(e)}), 500
