from app.models import db, CollectionImage, environment, SCHEMA
from sqlalchemy.sql import text


# Seed data for recipe images with captions
def seed_collection_images():

    collection_image1 = CollectionImage(
        image_url="https://data.thefeedfeed.com/static/2021/09/21/1632264639614a61bf03b09.jpg",
        collection_id=1,
        user_id=1, # Remy
        caption=""
    )

    collection_image2 = CollectionImage(
        image_url="https://data.thefeedfeed.com/static/2021/09/21/1632264639614a61bf03b09.jpg",
        collection_id=2,
        user_id=2, # Remy
        caption=""
    )


    collection_image3 = CollectionImage(
        image_url="https://bellyfull.net/wp-content/uploads/2021/02/Chicken-Alfredo-blog-4.jpg",
        collection_id=3,
        user_id=3, # Colette
        caption=""
    )

    collection_image4 = CollectionImage(
        image_url="https://panlasangpinoy.com/wp-content/uploads/2024/04/Filipino-Chicken-Adobo-Recipe.jpg",
        collection_id=4,
        user_id=4, # Lainey
        caption="family faves"
    )

    collection_image5 = CollectionImage(
        image_url="https://www.onceuponachef.com/images/2017/02/Asian-Vegetable-Stir-Fry-3-1700x1223.jpg",
        collection_id=5, # quick and easy
        user_id=1, # Remy
        caption=""
    )

    collection_image6 = CollectionImage(
        image_url="https://panlasangpinoy.com/wp-content/uploads/2022/08/pork-and-chicken-sinigang.jpg",
        collection_id=6, # comfort food
        user_id=2, # Alfredo
        caption=""
    )

    collection_image7 = CollectionImage(
        image_url="https://www.allrecipes.com/thmb/8NccFzsaq0_OZPDKmf7Yee-aG78=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/AvocadoToastwithEggFranceC4x3-bb87e3bbf1944657b7db35f1383fabdb.jpg",
        collection_id=7,  # quick breakfast
        user_id=2, # Alfredo
        caption=""
    )


    # Add the collection images to the session
    db.session.add(collection_image1)
    db.session.add(collection_image2)
    db.session.add(collection_image3)
    db.session.add(collection_image4)
    db.session.add(collection_image5)
    db.session.add(collection_image6)
    db.session.add(collection_image7)
    db.session.commit()

def undo_collection_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.collection_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM collection_images"))
    db.session.commit()
