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


        # Split the query string into individual keywords
        keywords = query.split()

        # Build a filter for partial matches on any of the fields
        recipe_results = Recipe.query.filter(
            db.or_(
                *[Recipe.name.ilike(f"%{keyword}%") for keyword in keywords] +
                [Recipe.cuisine.ilike(f"%{keyword}%") for keyword in keywords] +
                [Recipe.tags.ilike(f"%{keyword}%") for keyword in keywords]
                # +
                # [Recipe.owner_username.ilike(f"%{keyword}%") for keyword in keywords]
            )
        ).all()


        # Combine the results into a single response
        results = {
            'recipes': [recipe.to_dict() for recipe in recipe_results],
        }

        return jsonify(results), 200

    except Exception as e:
        current_app.logger.error(f"Error in search: {e}")
        return jsonify({
            'message': 'An error occurred while searching',
            'error': str(e)
        }), 500
