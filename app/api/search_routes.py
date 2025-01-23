from flask import Blueprint, current_app, json, jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from app.models import Recipe, Collection, User, db

search_routes = Blueprint('', __name__)

@search_routes.route('/', methods=["GET"])
def search():
    """
    Search recipes, collections, and users by name or keyword
    """

    try:
        query = request.args.get('q', '').strip().lower()

        if not query:
            return jsonify({
                'message': 'No query provided',
                'results': []
            }), 400


        # Search recipes by name
        recipe_results = Recipe.query.filter(
            (Recipe.name.ilike(f"%{query}%")) |
            (Recipe.cuisine.ilike(f"%{query}%")) |
            (Recipe.tags.ilike(f"%{query}%"))
            # (Recipe.owner_username.ilike(f"%{query}%"))
            ).all()
        # Search collections by name
        collection_results = Collection.query.filter(
            (Collection.name.ilike(f"%{query}%")) |
            (Collection.owner_username.ilike(f"%{query}"))
            ).all()
        # Search users by username
        user_results = User.query.filter(User.username.ilike(f"%{query}")).all()

        # Combine the results into a single response
        results = {
            'recipes': [recipe.to_dict() for recipe in recipe_results],
            'collections': [collection.to_dict() for collection in collection_results],
            'users': [user.to_dict() for user in user_results],
        }

        return jsonify(results), 200

    except Exception as e:
        current_app.logger.error(f"Error in search: {e}")
        return jsonify({
            'message': 'An error occurred while searching',
            'error': str(e)
        }), 500
