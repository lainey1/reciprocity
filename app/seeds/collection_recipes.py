from app.models import db, CollectionRecipe, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

# Seed data for collections
def seed_collection_recipes():
    collection_recipe1 = CollectionRecipe(
        collection_id=1,
        recipe_id=1,
        owner_id=1,  # Remy
        created_at=datetime(2025, 1, 10, 9, 0, 0),
        updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe2 = CollectionRecipe(
        collection_id=5,
        recipe_id=2,
        owner_id=1,  # Remy
        created_at=datetime(2025, 1, 10, 9, 0, 0),
        updated_at=datetime(2025, 1, 10, 9, 0, 0)

    )

    collection_recipe3 = CollectionRecipe(
        collection_id=3,
        recipe_id=3,
        owner_id=3,  # Colette
        created_at=datetime(2025, 1, 10, 9, 0, 0),
        updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe4 = CollectionRecipe(
        collection_id=6,
        recipe_id=3,
        owner_id=2,  # Alfredo

        created_at=datetime(2025, 1, 10, 9, 0, 0),
        updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe5 = CollectionRecipe(
        collection_id=7,
        recipe_id=4,
        owner_id=2,  # Alfredo

        created_at=datetime(2025, 1, 10, 9, 0, 0),
        updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe6 = CollectionRecipe(
        collection_id=7,
        recipe_id=4,
        owner_id=2,  # Alfredo

        created_at=datetime(2025, 1, 10, 9, 0, 0),
        updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe7 = CollectionRecipe(
        collection_id=5,
        recipe_id=4,
        owner_id=1,  # Remy

        created_at=datetime(2025, 1, 10, 9, 0, 0),
        updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe8 = CollectionRecipe(
            collection_id=3,
            recipe_id=5,
            owner_id=3,  # Colette

            created_at=datetime(2025, 1, 10, 9, 0, 0),
            updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe9 = CollectionRecipe(
            collection_id=4,
            recipe_id=6,
            owner_id=4,  # Lainey

            created_at=datetime(2025, 1, 10, 9, 0, 0),
            updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe10 = CollectionRecipe(
            collection_id=5,
            recipe_id=6,
            owner_id=1,  # Remy

            created_at=datetime(2025, 1, 10, 9, 0, 0),
            updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe11 = CollectionRecipe(
            collection_id=4,
            recipe_id=7,
            owner_id=4,  # Lainey

            created_at=datetime(2025, 1, 10, 9, 0, 0),
            updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe12 = CollectionRecipe(
            collection_id=4,
            recipe_id=8,
            owner_id=4,  # Lainey

            created_at=datetime(2025, 1, 10, 9, 0, 0),
            updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe13 = CollectionRecipe(
            collection_id=4,
            recipe_id=9,
            owner_id=1,  # Lainey

            created_at=datetime(2025, 1, 10, 9, 0, 0),
            updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe14 = CollectionRecipe(
            collection_id=4,
            recipe_id=10,
            owner_id=4,  # Lainey

            created_at=datetime(2025, 1, 10, 9, 0, 0),
            updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe15 = CollectionRecipe(
            collection_id=5,
            recipe_id=10,
            owner_id=1,  # Remy

            created_at=datetime(2025, 1, 10, 9, 0, 0),
            updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )

    collection_recipe16 = CollectionRecipe(
            collection_id=6,
            recipe_id=10,
            owner_id=2,  # Alfredo

            created_at=datetime(2025, 1, 10, 9, 0, 0),
            updated_at=datetime(2025, 1, 10, 9, 0, 0)
    )


    db.session.add(collection_recipe1)
    db.session.add(collection_recipe2)
    db.session.add(collection_recipe3)
    db.session.add(collection_recipe4)
    db.session.add(collection_recipe5)
    db.session.add(collection_recipe6)
    db.session.add(collection_recipe7)
    db.session.add(collection_recipe8)
    db.session.add(collection_recipe9)
    db.session.add(collection_recipe10)
    db.session.add(collection_recipe11)
    db.session.add(collection_recipe12)
    db.session.add(collection_recipe13)
    db.session.add(collection_recipe14)
    db.session.add(collection_recipe15)
    db.session.add(collection_recipe16)
    db.session.commit()

def undo_collection_recipes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.collection_recipes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM collection_recipes"))
    db.session.commit()
