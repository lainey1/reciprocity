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
def upload_image():
    form = ImageForm()
    form["csrf_token"].data = request.cookies.get("csrf_token")

    if form.validate_on_submit():
        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)

        if "image_url" not in upload:
            return jsonify({"errors": [upload]}), 400  # Bad Request

        image_url = upload["image_url"]
        new_image = RecipeImage(image_url=image_url, user_id=current_user.id)  # Ensure user_id is stored
        db.session.add(new_image)
        db.session.commit()

        return jsonify({"message": "Image uploaded successfully", "image_url": image_url}), 201  # Created

    return jsonify({"errors": form.errors}), 400  # Return validation errors


@recipe_images_routes.route("/upload", methods=["POST"])
@login_required
def upload_recipe_image():
    """
    Endpoint to upload a recipe image to S3 and save the image URL in the database.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if not file:
        return jsonify({'error': 'No file selected'}), 400

    # Upload to S3 and get the file URL
    s3_result = upload_file_to_s3(file, public=True)
    if not s3_result:
        return jsonify({"error": "Failed to upload"}), 500

    image_url = s3_result  # URL returned from S3 upload

    # Now, save the image URL in the database
    try:
        new_recipe_image = RecipeImage(
            image_url=image_url,
            recipe_id=request.form.get('recipe_id'),  # Assuming you pass recipe ID
            user_id=current_user.id,
            uploaded_at=datetime.now(timezone.utc)
        )

        db.session.add(new_recipe_image)
        db.session.commit()

        return jsonify({
            "message": "Recipe image uploaded successfully!",
            "image_url": image_url,
            "recipe_image": new_recipe_image.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    try:
        # Your file processing logic
        uploaded_urls = ["https://www.julieseatsandtreats.com/wp-content/uploads/2015/10/Sunshine-Fruit-Salad-Logo.jpg", "https://www.julieseatsandtreats.com/wp-content/uploads/2015/10/Sunshine-Fruit-Salad.jpg"]  # Replace with actual URLs
        return jsonify({"urls": uploaded_urls}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400



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
