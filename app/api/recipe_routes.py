from datetime import datetime, timezone

from flask import Blueprint, current_app, json, jsonify, request
from flask_login import current_user, login_required
from sqlalchemy.exc import SQLAlchemyError

from app.models import Recipe, RecipeImage, User, db

recipe_routes = Blueprint('recipes', __name__)

@recipe_routes.route('/', methods=["GET"])
def recipes():
    """
    Query to get all recipes.
    """

    try:
        # Check if the user is authenticated
        recipes = Recipe.query.all()


        # If no recipes are found, return an empty list with a success message
        if not recipes:
            return jsonify({
                'message': 'No recipes found',
                'recipes': []
            }), 200

        # Create a list of recipe dictionaries
        all_recipes_list = []
        for recipe in recipes:
            preview_image = RecipeImage.query.filter_by(recipe_id=recipe.id, is_preview=True).first()
            recipe_dict = recipe.to_dict()

            # Add additional data to the recipe dictionary
            recipe_dict['preview_image'] = preview_image.image_url if preview_image else None
            recipe_dict['prep_time'] = recipe_dict.get('prep_time') or None
            recipe_dict['cook_time'] = recipe_dict.get('cook_time') or None
            recipe_dict['short_description'] = recipe_dict.get('short_description') or ''
            recipe_dict['description'] = recipe_dict.get('description') or ''
            recipe_dict['tags'] = recipe_dict.get('tags') or []
            recipe_dict['ingredients'] = json.loads(recipe.ingredients) if recipe.ingredients else []
            recipe_dict['instructions'] = json.loads(recipe.instructions) if recipe.instructions else []

            # Fetch owner information
            owner = User.query.get(recipe.owner_id)
            if owner:
                recipe_dict['owner'] = owner.username

            all_recipes_list.append(recipe_dict)

        return jsonify(all_recipes_list), 200

    except SQLAlchemyError as e:
        current_app.logger.error(f"Database query error: {str(e)}")
        return jsonify({'message': 'An error occurred while fetching recipes. Please try again later.'}), 500

    except Exception as e:
        current_app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred. Please try again later.'}), 500


@recipe_routes.route('/<int:id>', methods=['GET'])
def get_recipe_by_id(id):
    """Get a single recipe by its ID."""
    try:
        # Fetch the recipe by ID
        recipe = Recipe.query.filter_by(id=id).first()

        # Check if the recipe exists
        if not recipe:
            return jsonify({
                'message': f'Recipe with ID {id} not found.'
            }), 404


        # Convert recipe to dictionary
        recipe_data = recipe.to_dict()

        # Fetch images for the restaurant
        recipe_images = RecipeImage.query.filter_by(recipe_id=recipe.id).all()
        images = [image.to_dict() for image in recipe_images]

        # Add images to recipe dictionary
        recipe_data['images'] = images

        # Fetch owner information
        owner = User.query.get(recipe.owner_id)
        if owner:
            recipe_data['owner'] = owner.username

        # Return the recipe data as JSON
        return jsonify({'recipe': recipe_data}), 200

    except SQLAlchemyError as e:
        current_app.logger.error(f"Database query error: {str(e)}")
        return jsonify({'message': 'An error occurred while fetching the recipe. Please try again later.'}), 500

    except Exception as e:
        current_app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'message': 'An unexpected error occurred. Please try again later.'}), 500


@recipe_routes.route('/owner/<int:owner_id>', methods=['GET'])
def recipes_by_owner(owner_id):
    """
    Query to retrieve all recipes for a specific owner ID.
    """
    try:

        recipes_by_owner = Recipe.query.filter_by(owner_id=owner_id).all()

        # If no recipes found, return a message indicating no recipes
        if not recipes_by_owner:
            return jsonify({
                'message': 'No recipes found for this owner.'
            }), 404

        # Make an empty list to store owner's recipes
        owners_recipes_list = []

        # Go through each recipe
        for recipe in recipes_by_owner:
            # Convert to single recipe dictionary
            recipe_data = recipe.to_dict()

            # Grab its preview image
            preview_image = RecipeImage.query.filter_by(recipe_id=recipe.id, is_preview=True).first()
            preview_image_url = preview_image.image_url if preview_image else None

            # Add preview image to recipe's dictionary
            recipe_data['preview_image'] = preview_image_url

            # Append the recipe dictionary to the owner's recipes list
            owners_recipes_list.append(recipe_data)

        # Return the data as JSON
        return jsonify({
            'recipes_owned_by_user': owners_recipes_list
        }), 200

    except SQLAlchemyError as e:
        # Log the error (for debugging purposes) and return as a generic error message
        current_app.logger.error(f"Database query error: {str(e)}")
        return jsonify({
            'message': 'An error occurred while fetching recipes. Please try again later.'
        }), 500

    except Exception as e:
        # Catch any other unexpected errors
        current_app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({
            'message': 'An unexpected error occurred. Please try again later.'
        }), 500


@recipe_routes.route('/new', methods=["POST"])
@login_required
def add_recipe():
    """
    Route to add new recipe.
    - User must be logged in.
    """

    try:
        payload = request.json

        # Validate required fields are in the payload
        required_fields = ["name", "yield_servings", "ingredients", "instructions"]
        missing_fields = [field for field in required_fields if field not in payload or not payload[field]]
        if missing_fields:
            return jsonify({
                "message": "Missing required fields.",
                "missing_fields": missing_fields
            }), 400

        # Extract data from the payload
        ingredients = payload.get("ingredients", [])
        instructions = payload.get("instructions", [])
        tags = payload.get("tags", "")

        # Serialize ingredients and instructions
        ingredients_json = json.dumps([{"ingredient": ingredient} for ingredient in ingredients])
        instructions_json = json.dumps([{"instruction": instruction} for instruction in instructions])

        # Handle tags
        if isinstance(tags, str):
            tags_string = ','.join([tag.strip() for tag in tags.split(",") if tag.strip()])
        else:
            tags_string = ''

        # Get current time and use datetime object
        now = datetime.now(timezone.utc)

        new_recipe = Recipe(
            name=payload.get("name"),
            owner_id=current_user.id,
            yield_servings=payload.get("yield_servings"),
            prep_time=payload.get("prep_time"),
            cook_time=payload.get("cook_time"),
            total_time=payload.get("total_time"),
            cuisine=payload.get("cuisine"),
            short_description=payload.get("short_description"),
            description=payload.get("description"),
            tags=tags_string,
            ingredients=ingredients_json,  # Store as JSON string
            instructions=instructions_json,  # Store as JSON string
            created_at=now,  # Pass datetime object directly
            updated_at=now   # Pass datetime object directly
        )

        print(f"Attempting to add recipe with name: {new_recipe.name}")

        try:
            db.session.add(new_recipe)
            db.session.commit()
            print(f"Successfully added recipe with ID: {new_recipe.id}")
        except Exception as e:
            print(f"Failed to add recipe {new_recipe.name}: {str(e)}")
            db.session.rollback()
            raise

        return jsonify({
            "message": "Recipe created successfully!",
            "recipe": new_recipe.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()  # Rollback changes if error occurs
        print(f"Error in /new route: {e}")  # Log the error
        return jsonify({
            "message": "Failed to create recipe",
            "error": str(e)
        }), 500


@recipe_routes.route('/<int:recipe_id>/edit', methods=["PUT"])
@login_required
def update_recipe(recipe_id):
    """
    Route to update a recipe by ID.
    - User must be owner.
    """

    ## Debugging lines:
    # print(f"Request received on /{recipe_id}/edit with method {request.method}")
    # data = request.get_json()
    # print("DATA =====>", data)

    # Fetch recipe by ID
    recipe = Recipe.query.get(recipe_id)
    if not recipe:
        return jsonify({'message': 'Recipe not found'}), 404

    # Check if the current user is the recipe's owner
    if recipe.owner_id != current_user.id:
        return jsonify({'message': 'You are not authorized to update this recipe. Please log in as the owner.'}), 403

    # Get data from request
    try:
        recipe_data = request.get_json()
        print("Request data:", recipe_data)
    except Exception as e:
        print(f"Error parsing JSON in /{recipe_id}/edit route: {e}")
        return jsonify({"message": "Failed to parse request data", "error": str(e)}), 400

    # Validate required fields are in the payload
    required_fields = ["name", "yield_servings", "ingredients", "instructions"]
    missing_fields = [field for field in required_fields if field not in recipe_data]

    if missing_fields:
        return jsonify({
            "message": "Missing required fields.",
            "missing_fields": missing_fields
        }), 400

    # Extract ingredients, instructions & tags data from the payload
    ingredients = recipe_data.get("ingredients", [])
    instructions = recipe_data.get("instructions", [])
    tags = recipe_data.get("tags", "")

    # Serialize ingredients, instructions & tags
    ingredients_json = json.dumps([{"ingredient": ingredient} for ingredient in ingredients])
    instructions_json = json.dumps([{"instruction": instruction} for instruction in instructions])

    tags_string = ','.join([tag.strip() for tag in tags.split(",") if tag.strip()])

    # Update recipe fields
    recipe.name = recipe_data['name']
    recipe.yield_servings = recipe_data['yield_servings']
    recipe.prep_time = recipe_data.get('prep_time', 0)
    recipe.cook_time = recipe_data.get('cook_time', 0)
    recipe.total_time = recipe_data.get('total_time', 0)
    recipe.cuisine = recipe_data.get('cuisine', "")
    recipe.short_description = recipe_data.get('short_description', "")
    recipe.description = recipe_data.get('description', "")
    recipe.tags = tags_string
    recipe.ingredients = ingredients_json
    recipe.instructions = instructions_json

    # Save changes to the database
    try:
        db.session.commit()
    except Exception as e:
        print(f"Error updating recipe {recipe_id}: {str(e)}")
        db.session.rollback()
        return jsonify({"message": "Failed to update recipe", "error": str(e)}), 500

    return jsonify({
        "message": "Recipe updated successfully!",
        "recipe": recipe.to_dict()
    }), 200


@recipe_routes.route('/<int:id>', methods=['DELETE'])
def delete_recipe(id):
    """
    Route to delete a recipe by ID.
    - User must be owner.

    """
    recipe = Recipe.query.get(id)

    if not recipe:
        return {'error': f'Recipe with ID {id} not found.'}, 404

    if request.method == 'DELETE':
        # Check if the current user is the owner of the restaurant
        if recipe.owner_id != current_user.id:
            return {'error': 'You are not authorized to delete this recipe.'}, 403

        db.session.delete(recipe)
        db.session.commit()
        return {'message': f'Recipe with ID {id} deleted successfully.'}, 200
