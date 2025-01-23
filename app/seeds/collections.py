from app.models import db, Collection, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Seed data for collections
def seed_collections():
    family_collection1 = Collection(
        name="Family Recipes",
        description="A collection of family recipes and memories.",
        user_id=1,  # Remy,
        owner_username="little_chef",

        created_at=datetime(2024, 12, 10, 9, 0, 0),
        updated_at=datetime(2024, 12, 10, 9, 0, 0)
    )

    family_collection2 = Collection(
        name="Family Recipes",
        description="A collection of family recipes and memories.",
        user_id=2,  # Alfredo
        owner_username="i_am_linguini",

        created_at=datetime(2024, 12, 11, 8, 30, 0),
        updated_at=datetime(2024, 12, 11, 8, 30, 0)
    )

    family_collection3 = Collection(
        name="Family Recipes",
        description="A collection of family recipes and memories.",
        user_id=3,  # Colette
        owner_username="anyone_can_cook",

        created_at=datetime(2024, 12, 12, 9, 0, 0),
        updated_at=datetime(2024, 12, 12, 9, 0, 0)
    )

    family_collection4 = Collection(
        name="Family Recipes",
        description="A collection of family recipes and memories.",
        user_id=4,  # Lainey
        owner_username="lainey",

        created_at=datetime(2024, 12, 13, 10, 0, 0),
        updated_at=datetime(2024, 12, 13, 10, 0, 0)
    )

    quick_n_easy = Collection(
        name="Quick & Easy",
        description="Recipes for busy weeknights, easy to prepare and delicious.",
        user_id=1,  # Remy
        owner_username="little_chef",

        created_at=datetime(2024, 12, 12, 8, 30, 0),
        updated_at=datetime(2024, 12, 12, 8, 30, 0)
    )

    comfort_food = Collection(
        name="Comfort Food",
        description="A collection of warm and hearty recipes for cozy nights.",
        user_id=2,  # Alfredo
        owner_username="i_am_linguini",

        created_at=datetime(2024, 12, 14, 9, 0, 0),
        updated_at=datetime(2024, 12, 14, 9, 0, 0)
    )

    quick_breakfast = Collection(
        name="Quick Breakfasts",
        description="Quick and easy breakfast recipes to kickstart your day.",
        user_id=2,  # Alfredo
        owner_username="i_am_linguini",

        created_at=datetime(2024, 12, 15, 10, 0, 0),
        updated_at=datetime(2024, 12, 15, 10, 0, 0)
    )

    db.session.add(family_collection1)
    db.session.add(family_collection2)
    db.session.add(family_collection3)
    db.session.add(family_collection4)
    db.session.add(quick_n_easy)
    db.session.add(comfort_food)
    db.session.add(quick_breakfast)
    db.session.commit()

def undo_collections():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.collections RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM collections"))
    db.session.commit()
