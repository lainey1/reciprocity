# app/models/collection_recipe.py
from datetime import datetime, timezone

from .db import db, environment, SCHEMA, add_prefix_for_prod


class CollectionRecipe(db.Model):
    __tablename__ = 'collection_recipes'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    collection_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('collections.id')), nullable=False)
    recipe_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('recipes.id')), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    owner_username = db.Column(db.String, db.ForeignKey(add_prefix_for_prod('users.username')), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    # Relationships

    def to_dict(self):
        return {
            'id': self.id,
            'collection_id': self.collection_id,
            'recipe_id': self.recipe_id,
            'owner_id': self.owner_id,
            'owner_username': self.owner_username,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }
