# app/models/collection.py
from datetime import datetime, timezone

from .db import db, environment, SCHEMA, add_prefix_for_prod


class Collection(db.Model):
    __tablename__ = 'collections'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    description = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc), nullable=False)

    # Relationships
    collection_images = db.relationship('CollectionImage', backref='collection', lazy=True)
    recipes = db.relationship('CollectionRecipe', backref='collection', lazy=True)


    def to_dict(self):
        collection_dict = {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

        # Include associated recipes
        collection_dict['recipes'] = [recipe.recipe.to_dict() for recipe in self.recipes]

        return collection_dict
