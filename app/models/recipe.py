#app/models/recipe.py
import json
from datetime import datetime, timezone

from .db import db, environment, SCHEMA, add_prefix_for_prod


class Recipe(db.Model):
    __tablename__ = 'recipes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    yield_servings = db.Column(db.Integer, nullable=False)
    prep_time = db.Column(db.Integer, nullable=True)
    cook_time = db.Column(db.Integer, nullable=True)
    total_time = db.Column(db.Integer, nullable=False)
    short_description = db.Column(db.String(150), nullable=True)
    cuisine = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    ingredients = db.Column(db.JSON, nullable=False)
    instructions = db.Column(db.JSON, nullable=False)
    tags = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)




    # Relationships with cascade delete
    recipe_collections = db.relationship(
        'CollectionRecipe',
        backref='recipe',
        lazy=True,
        cascade='all, delete-orphan'
    )
    recipe_images = db.relationship(
        'RecipeImage',
        backref='recipe',
        lazy=True,
        cascade='all, delete-orphan'
    )
    # recipe_pins = db.relationship(
    #     'RecipePin',
    #     backref='recipe',
    #     lazy=True,
    #     cascade='all, delete-orphan'
    # )
    # recipe_reviews = db.relationship(
    #     'RecipeReview',
    #     backref='recipe',
    #     lazy=True,
    #     cascade='all, delete-orphan'
    # )

    def to_dict(self):
        # Find the preview image if it exists
        preview_image = next(
        (image for image in self.recipe_images if image.is_preview), None
    )
        recipe_dict = {
            'id': self.id,
            'name': self.name,
            'owner_id': self.owner_id,
            'yield_servings': self.yield_servings,
            'prep_time': self.prep_time,
            'cook_time': self.cook_time,
            'total_time': self.total_time,
            'short_description': self.short_description,
            'cuisine': self.cuisine,
            'description': self.description,
            # 'ingredients': self.ingredients,
            # 'instructions': self.instructions,
            "ingredients": json.loads(self.ingredients),  # Deserialize JSON string
            "instructions": json.loads(self.instructions),  # Deserialize JSON string
            'tags': self.tags,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'preview_image': preview_image.image_url if preview_image else None,
            # Include recipe images
            'recipe_images': [image.to_dict() for image in self.recipe_images]



        }
        return recipe_dict
