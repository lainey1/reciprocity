import json
from app.models import db, Recipe, environment, SCHEMA
from sqlalchemy.sql import text

from datetime import datetime, timezone

# Convert the ISO string to a datetime object with timezone
created_at_time = datetime.fromisoformat("2024-12-16T10:00:00+00:00").astimezone(
    timezone.utc
)
updated_at_time = datetime.fromisoformat("2024-12-16T10:00:00+00:00").astimezone(
    timezone.utc
)


# Adds demo recipes
def seed_recipes():
    recipe1 = Recipe(
        name="Remy's Ratatouille",
        yield_servings=4,
        prep_time=20,
        cook_time=45,
        total_time=65,
        short_description="Anton Ego approved. Long and narrow vegetables work best. Serve with crusty bread or over a bed of brown rice, couscous, or pasta.",
        cuisine="French",
        description="Ratatouille, as popularized by the charming animated movie, is a vibrant, Mediterranean vegetable dish that showcases the beauty of simple, fresh ingredients. This classic French recipe layers thinly sliced vegetables like eggplant, zucchini, yellow squash, and bell peppers in a rich tomato sauce, creating a feast for both the eyes and the palate. The vegetables are roasted until tender, soaking up the savory tomato sauce, olive oil, and fresh thyme. A dollop of creamy mascarpone cheese adds a luxurious finish. This dish is perfect as a side or a main course and pairs beautifully with crusty bread, brown rice, couscous, or pasta. Whether you're enjoying it as a family meal or sharing it with friends, Remy's Ratatouille will surely delight and impress with its harmony of flavors.",
        ingredients=json.dumps([
            {"ingredient": "1 (6 ounce) can tomato paste"},
            {"ingredient": "1/2 onion, chopped"},
            {"ingredient": "1/4 cup minced garlic"},
            {"ingredient": "3/4 cup water"},
            {"ingredient": "4 tablespoons olive oil, divided"},
            {"ingredient": "Salt and ground black pepper to taste"},
            {"ingredient": "1 small eggplant, trimmed and very thinly sliced"},
            {"ingredient": "1 zucchini, trimmed and very thinly sliced"},
            {"ingredient": "1 yellow squash, trimmed and very thinly sliced"},
            {"ingredient": "1 red bell pepper, cored and very thinly sliced"},
            {"ingredient": "1 yellow bell pepper, cored and very thinly sliced"},
            {"ingredient": "1 teaspoon fresh thyme leaves, or to taste"},
            {"ingredient": "3 tablespoons mascarpone cheese"}
        ]),
        instructions=json.dumps([
            {"instruction": "Preheat the oven to 375 degrees F (190 degrees C)."},
            {"instruction": "Spread tomato paste onto the bottom of a 10-inch square baking dish."},
            {"instruction": "Sprinkle with onion and garlic."},
            {"instruction": "Stir in water and 1 tablespoon olive oil until thoroughly combined."},
            {"instruction": "Season with salt and pepper."},
            {"instruction": "Arrange alternating slices of eggplant, zucchini, yellow squash, red bell pepper, and yellow bell pepper, starting at the outer edge of the dish and working concentrically towards the center."},
            {"instruction": "Overlap slices slightly to display colors."},
            {"instruction": "Drizzle vegetables with remaining 3 tablespoons olive oil; season with salt and pepper."},
            {"instruction": "Sprinkle with thyme leaves."},
            {"instruction": "Cover vegetables with a piece of parchment paper cut to fit inside."},
            {"instruction": "Bake in the preheated oven until vegetables are roasted and tender, about 45 minutes."},
            {"instruction": "Serve with dollops of mascarpone cheese."}
        ]),
        tags="vegetarian, healthy, French, classic",
        # tags=["vegetarian", "healthy", "French", "classic"],
        owner_id=1,
        owner_username="little_chef",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe2 = Recipe(
        name="Veggie Stir-Fry",
        yield_servings=2,
        prep_time=10,
        cook_time=15,
        total_time=25,
        short_description="A healthy and flavorful stir-fry with mixed veggies.",
        cuisine="Asian",
        description="A quick and satisfying dish that brings together the freshest, crisp vegetables in a savory stir-fry sauce, Veggie Stir-Fry is a healthful and delicious option for any meal. Broccoli, bell peppers, and carrots are tossed in fragrant sesame oil and soy sauce, creating a perfect balance of texture and flavor. This vibrant dish is perfect over steamed rice, making it a light yet filling meal that you can prepare in just under 30 minutes. Ideal for busy weeknights, this simple stir-fry is packed with nutritious ingredients that provide a burst of color and taste in every bite. Whether you're a vegetarian or just looking to incorporate more vegetables into your diet, this Veggie Stir-Fry will quickly become a staple in your kitchen.",
        ingredients=json.dumps([
            {"ingredient": "Broccoli"},
            {"ingredient": "bell peppers"},
            {"ingredient": "carrots"},
            {"ingredient": "soy sauce"},
            {"ingredient": "sesame oil"},
            {"ingredient": "rice"}
        ]),
        instructions=json.dumps([
            {"instruction": "Stir-fry the vegetables in sesame oil, add soy sauce, and serve over rice."}
        ]),
        tags="vegetarian, stir-fry, healthy",
        # tags=["vegetarian", "stir-fry", "healthy"],
        owner_id=2,
        owner_username="i_am_linguini",


        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe3 = Recipe(
        name="Mama's Chicken Alfredo",
        yield_servings=4,
        prep_time=15,
        cook_time=20,
        total_time=35,
        short_description="Creamy chicken alfredo pasta.",
        cuisine="Italian",
        description="Mama's Chicken Alfredo is a comforting, soul-soothing dish that combines creamy, velvety Alfredo sauce with perfectly cooked chicken and tender fettuccine pasta. The richness of the heavy cream and butter melds with the sharpness of Parmesan cheese to create a decadent sauce that clings to each strand of pasta. The addition of succulent, seasoned chicken breast makes this dish hearty and filling. Whether enjoyed on a cozy night in or served for a special occasion, this dish is sure to satisfy. Simple to make yet full of flavor, Mama's Chicken Alfredo is the ultimate indulgence for pasta lovers and a crowd-pleaser at any dinner table."
,
        ingredients=json.dumps([
            {"ingredient": "Chicken breast"},
            {"ingredient": "fettuccine pasta"},
            {"ingredient": "heavy cream"},
            {"ingredient": "parmesan cheese"},
            {"ingredient": "garlic"},
            {"ingredient": "butter"}
        ]),
        instructions=json.dumps([
            {"instruction": "Cook the fettuccine pasta."},
            {"instruction": "In a pan, cook chicken breast, then make the alfredo sauce with butter, garlic, and cream."},
            {"instruction": "Combine pasta and sauce."}
        ]),
        tags="pasta, creamy, chicken, Italian",
        # tags=["pasta", "creamy", "chicken", "Italian"],
                owner_id=3,
        owner_username="anyone_can_cook",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe4 = Recipe(
        name="Avocado Toast",
        yield_servings=2,
        prep_time=5,
        cook_time=5,
        total_time=10,
        short_description="Simple and delicious avocado toast.",
        cuisine="American",
        description="Avocado Toast is the ultimate breakfast or brunch dish, with creamy mashed avocado spread generously over toasted bread. A sprinkle of lemon juice, salt, and pepper enhances the natural flavor of the avocado, making every bite as fresh as it is satisfying. Topping the toast with a perfectly poached egg adds richness and makes it a complete, balanced meal. This dish is quick to prepare yet deliciously indulgent, making it perfect for busy mornings or a leisurely weekend breakfast. Avocado Toast is not just a meal; it's a celebration of simple, wholesome ingredients that are both nourishing and flavorful."
,
        ingredients=json.dumps([
            {"ingredient": "Avocado"},
            {"ingredient": "bread"},
            {"ingredient": "egg"},
            {"ingredient": "olive oil"},
            {"ingredient": "lemon juice"},
            {"ingredient": "salt"},
            {"ingredient": "pepper"}
        ]),
        instructions=json.dumps([
            {"instruction": "Toast the bread."},
            {"instruction": "Mash the avocado with olive oil, lemon juice, salt, and pepper."},
            {"instruction": "Spread on toast and top with a poached egg."}
        ]),
        tags="breakfast, healthy, avocado, easy",
        # tags=["breakfast", "healthy", "avocado", "easy"],
                owner_id=4,
        owner_username="lainey",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe5 = Recipe(
        name="Papa's Smash Burger",
        yield_servings=4,
        prep_time=15,
        cook_time=10,
        total_time=25,
        short_description="Juicy gourmet burgers.",
        cuisine="American",
        description="Papa's Smash Burger is the quintessential American burger—juicy, flavorful, and utterly satisfying. Made with high-quality beef patties, these burgers are smashed on the grill to create a perfect crust on the outside while remaining tender and juicy on the inside. Served on toasted buns with a layer of melted cheese, crisp lettuce, and juicy tomato, this burger is the epitome of comfort food. With a side of crispy, hand-cut fries, it's a meal that hits all the right notes. Perfect for grilling season or any time you're craving a classic, satisfying burger, Papa's Smash Burger is guaranteed to be a hit with family and friends.",
        ingredients=json.dumps([
            {"ingredient": "Beef patties"},
            {"ingredient": "lettuce"},
            {"ingredient": "tomato"},
            {"ingredient": "cheese"},
            {"ingredient": "burger buns"},
            {"ingredient": "fries"}
        ]),
        instructions=json.dumps([
            {"instruction": "Grill the beef patties."},
            {"instruction": "Toast the buns."},
            {"instruction": "Assemble the burger with cheese, lettuce, and tomato."}
        ]),
        tags="burger, gourmet, American",
        # tags=["vegetarian", "healthy", "French", "classic"],
                owner_id=3,
        owner_username="anyone_can_cook",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe6 = Recipe(
        name="Grandma's Chicken Adobo",
        yield_servings=4,
        prep_time=10,
        cook_time=45,
        total_time=55,
        short_description="A classic Filipino dish with savory, tangy flavors.",
        cuisine="Filipino",
        description="Grandma's Chicken Adobo is a beloved Filipino dish that is both savory and tangy, thanks to the harmonious blend of soy sauce, vinegar, garlic, and spices. The chicken simmers slowly in this flavorful marinade, becoming incredibly tender and infused with the perfect balance of salty and sour notes. Adobo is a staple in Filipino households, often served with rice to soak up the delicious sauce. This dish is more than just a meal—it's a reminder of family, tradition, and the comforting flavors that have been passed down through generations. Whether you're enjoying it for a special gathering or a regular weeknight dinner, Grandma's Chicken Adobo is sure to bring a taste of home to your table.",
        ingredients=json.dumps([
            {"ingredient": "Chicken drumsticks or thighs"},
            {"ingredient": "soy sauce"},
            {"ingredient": "vinegar"},
            {"ingredient": "garlic"},
            {"ingredient": "bay leaves"},
            {"ingredient": "black peppercorns"},
            {"ingredient": "water"},
            {"ingredient": "oil for frying"}
        ]),
        instructions=json.dumps([
            {"instruction": "In a large bowl, combine soy sauce, vinegar, garlic, bay leaves, and black pepper."},
            {"instruction": "Add chicken pieces and marinate for at least 30 minutes."},
            {"instruction": "In a large pot, heat oil and brown the chicken on all sides."},
            {"instruction": "Add the marinade and water, and simmer for 40 minutes until the chicken is tender."},
            {"instruction": "Serve with rice."}
        ]),
        tags="Filipino, savory, chicken",
                owner_id=4,
        owner_username="lainey",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe7 = Recipe(
        name="Gina's Cannoli",
        yield_servings=6,
        prep_time=25,
        cook_time=10,
        total_time=35,
        short_description="Crispy pastry shells filled with creamy ricotta filling.",
        cuisine="Italian",
        description="Gina's Cannoli are the perfect Italian dessert—crispy, golden pastry shells filled with a sweet, creamy ricotta filling. These delicate treats are a delight to both the eyes and the taste buds. The combination of the light and crunchy shell with the rich, smooth filling creates a perfect contrast of textures. A hint of cinnamon and vanilla in the ricotta, along with a sprinkle of chocolate chips, adds a touch of indulgence to these classic cannoli. Whether served as a sweet treat after a hearty meal or as a dessert for special occasions, Gina's Cannoli will make any celebration feel extra special.",
        ingredients=json.dumps([
            {"ingredient": "Cannoli shells"},
            {"ingredient": "ricotta cheese"},
            {"ingredient": "powdered sugar"},
            {"ingredient": "vanilla extract"},
            {"ingredient": "chocolate chips"},
            {"ingredient": "cinnamon"}
        ]),
        instructions=json.dumps([
            {"instruction": "In a bowl, mix ricotta, powdered sugar, vanilla extract, and cinnamon."},
            {"instruction": "Fill cannoli shells with the ricotta mixture."},
            {"instruction": "Sprinkle with chocolate chips and serve."}
        ]),
        tags="dessert, Italian, sweet",
                owner_id=4,
        owner_username="lainey",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe8 = Recipe(
        name="Lisa's Sinigang",
        yield_servings=4,
        prep_time=15,
        cook_time=60,
        total_time=75,
        short_description="A tangy, savory Filipino soup with a tamarind-based broth.",
        cuisine="Filipino",
        description="Lisa's Sinigang is a comforting and flavorful Filipino soup that offers a perfect balance of savory, tangy, and umami flavors. The key to this beloved dish is the tamarind base, which gives the broth its signature sourness. Tender pork, shrimp, or fish is simmered in this broth along with a variety of fresh vegetables like eggplant, long green beans, and radish, adding texture and heartiness to the dish. Served with steamed rice, Sinigang is the perfect antidote to any rainy day or a hearty family meal. With its comforting warmth and bold flavors, Lisa's Sinigang is sure to be a crowd favorite.",
        ingredients=json.dumps([
            {"ingredient": "Pork, shrimp, or fish"},
            {"ingredient": "tamarind paste"},
            {"ingredient": "water"},
            {"ingredient": "tomatoes"},
            {"ingredient": "onions"},
            {"ingredient": "long green beans"},
            {"ingredient": "eggplant"},
            {"ingredient": "radish"},
            {"ingredient": "spinach or kangkong"}
        ]),
        instructions=json.dumps([
            {"instruction": "In a large pot, combine water, tamarind paste, tomatoes, and onions."},
            {"instruction": "Bring to a boil and simmer for 30 minutes."},
            {"instruction": "Add pork, shrimp, or fish and cook until tender."},
            {"instruction": "Add vegetables and cook until tender."},
            {"instruction": "Season with salt to taste and serve with rice."}
        ]),
        tags="Filipino, soup, savory, tangy",
                owner_id=4,
        owner_username="lainey",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe9 = Recipe(
        name="Dad's Fried Filipino Plantains",
        yield_servings=4,
        prep_time=5,
        cook_time=10,
        total_time=15,
        short_description="Sweet and crispy fried plantains, a popular Filipino snack.",
        cuisine="Filipino",
        description="Dad's Fried Filipino Plantains are a simple yet irresistible treat that combines the sweetness of ripe plantains with the crunch of a crispy exterior. Sliced into rounds and fried to golden perfection, these plantains are then lightly dusted with brown sugar for added sweetness. Whether enjoyed as a snack or as a side dish to complement savory meals, these fried plantains are a popular choice in Filipino households. Their natural sweetness and satisfying crunch make them the perfect bite-sized indulgence. Serve them on their own or with a side of dipping sauce for a delicious treat that's sure to please everyone.",
        ingredients=json.dumps([
            {"ingredient": "Plantains"},
            {"ingredient": "vegetable oil"},
            {"ingredient": "brown sugar"}
        ]),
        instructions=json.dumps([
            {"instruction": "Peel and slice the plantains into rounds."},
            {"instruction": "Heat oil in a frying pan."},
            {"instruction": "Fry the plantains until golden and crispy."},
            {"instruction": "Sprinkle with brown sugar and serve."}
        ]),
        tags="Filipino, snack, sweet, fried",
                owner_id=4,
        owner_username="lainey",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe10 = Recipe(
        name="Gina's Taco Soup",
        yield_servings=6,
        prep_time=15,
        cook_time=30,
        total_time=45,
        short_description="A hearty, spicy, and flavorful taco-inspired soup.",
        cuisine="American",
        description="Gina's Taco Soup is a hearty and flavorful dish that brings all the delicious flavors of a taco into a comforting bowl of soup. Made with ground beef or turkey, this soup is packed with savory ingredients like tomatoes, black beans, and corn, all simmered in a rich, flavorful broth. A generous sprinkle of taco seasoning brings the soup to life with a little kick of spice, while cheese, sour cream, and tortilla chips make the perfect toppings for added richness and crunch. Whether served for a cozy family dinner or a casual gathering with friends, Gina's Taco Soup is the perfect dish for any occasion, offering a taste of the beloved taco in soup form.",
        ingredients=json.dumps([
            {"ingredient": "Ground beef or turkey"},
            {"ingredient": "onion"},
            {"ingredient": "garlic"},
            {"ingredient": "taco seasoning"},
            {"ingredient": "tomatoes"},
            {"ingredient": "black beans"},
            {"ingredient": "corn"},
            {"ingredient": "chicken broth"},
            {"ingredient": "cheese, sour cream, and tortilla chips for topping"}
        ]),
        instructions=json.dumps([
            {"instruction": "In a large pot, brown the ground beef or turkey with onion and garlic."},
            {"instruction": "Add taco seasoning, tomatoes, black beans, corn, and chicken broth."},
            {"instruction": "Simmer for 20 minutes."},
            {"instruction": "Serve with cheese, sour cream, and tortilla chips."}
        ]),
        tags="soup, taco, savory, hearty",
                owner_id=4,
        owner_username="lainey",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe11 = Recipe(
    name="Coq au Vin",
    yield_servings=6,
    prep_time=30,
    cook_time=120,
    total_time=150,
    short_description="A traditional French chicken dish slow-cooked in red wine with mushrooms, onions, and herbs.",
    cuisine="French",
    description="Coq au Vin is a beloved French dish that transforms simple chicken into a rich, decadent meal. The chicken pieces are slow-cooked in a luxurious red wine sauce, absorbing all the deep, flavorful notes of the wine, herbs, and smoky bacon. Tender mushrooms, pearl onions, and crispy bacon lardons are added towards the end, infusing the dish with earthy, savory goodness. This slow-cooked comfort food is perfect for a cozy dinner or a special occasion, offering a taste of classic French cuisine in every bite. Whether paired with mashed potatoes to soak up the sauce or served with crusty bread, this dish is sure to impress with its depth of flavor and melt-in-your-mouth tenderness. The balance of wine, herbs, and aromatics creates a perfect symphony of flavors that elevate the chicken to new heights. Coq au Vin is not only a delicious dish but a true culinary experience—one that takes time to prepare but rewards you with its heartwarming richness.",
    ingredients=json.dumps([
        {"ingredient": "1 whole chicken, cut into pieces"},
        {"ingredient": "2 tablespoons olive oil"},
        {"ingredient": "1 medium onion, chopped"},
        {"ingredient": "2 cloves garlic, minced"},
        {"ingredient": "2 cups red wine"},
        {"ingredient": "1 cup chicken stock"},
        {"ingredient": "1 bay leaf"},
        {"ingredient": "1 teaspoon fresh thyme"},
        {"ingredient": "1/2 cup mushrooms, sliced"},
        {"ingredient": "1/2 cup pearl onions, peeled"},
        {"ingredient": "1/4 cup bacon lardons, diced"},
        {"ingredient": "Salt and pepper to taste"},
    ]),
    instructions=json.dumps([
        {"instruction": "Heat olive oil in a large Dutch oven over medium heat."},
        {"instruction": "Brown the chicken pieces on all sides, then remove from the pot."},
        {"instruction": "Add chopped onion and garlic, and cook until softened."},
        {"instruction": "Return chicken to the pot, and pour in red wine and chicken stock."},
        {"instruction": "Add thyme, bay leaf, and season with salt and pepper."},
        {"instruction": "Bring to a simmer, then reduce heat and cover. Cook for 90 minutes."},
        {"instruction": "In a separate pan, cook bacon lardons until crispy, then add mushrooms and pearl onions, and cook until browned."},
        {"instruction": "After 90 minutes, add the mushrooms, onions, and bacon to the pot."},
        {"instruction": "Simmer for another 30 minutes, until the chicken is tender."},
        {"instruction": "Serve hot with crusty bread or mashed potatoes."}
    ]),
    tags="chicken, French, classic, comfort food",
            owner_id=1,
        owner_username="little_chef",

    created_at=created_at_time,
    updated_at=created_at_time,
    )

    recipe12 = Recipe(
        name="Quiche Lorraine",
        yield_servings=8,
        prep_time=15,
        cook_time=45,
        total_time=60,
        short_description="A savory French tart filled with eggs, cream, bacon, and cheese.",
        cuisine="French",
        description="Quiche Lorraine is a classic French savory tart known for its indulgent, creamy texture and rich flavors. This dish combines a velvety egg custard made from eggs, heavy cream, and milk, with the irresistible savoriness of crispy bacon and the melt-in-your-mouth goodness of Swiss and Gruyère cheeses. The buttery, flaky pie crust serves as the perfect base to hold this luxurious filling, making every bite a delightful balance of flavors and textures. With a delicate seasoning of nutmeg, pepper, and salt, this quiche strikes the ideal note of savory comfort. It's an ideal dish for brunch, offering both richness and subtlety, and can be enjoyed warm or at room temperature. Whether you're serving it as a centerpiece for a special occasion or as a simple yet elegant meal, Quiche Lorraine never fails to impress. Its timeless appeal is perfect for any gathering, delivering a delicious slice of French culinary tradition in every bite.",
        ingredients=json.dumps([
            {"ingredient": "1 pre-made pie crust"},
            {"ingredient": "8 large eggs"},
            {"ingredient": "1 cup heavy cream"},
            {"ingredient": "1/2 cup milk"},
            {"ingredient": "1/2 teaspoon salt"},
            {"ingredient": "1/4 teaspoon ground black pepper"},
            {"ingredient": "1/4 teaspoon ground nutmeg"},
            {"ingredient": "1 cup cooked bacon, crumbled"},
            {"ingredient": "1 cup grated Swiss cheese"},
            {"ingredient": "1/2 cup grated Gruyère cheese"},
        ]),
        instructions=json.dumps([
            {"instruction": "Preheat the oven to 375°F (190°C)."},
            {"instruction": "In a large bowl, whisk together eggs, cream, milk, salt, pepper, and nutmeg."},
            {"instruction": "Stir in crumbled bacon and grated cheese."},
            {"instruction": "Pour the mixture into the pie crust."},
            {"instruction": "Bake for 35-45 minutes, until the quiche is set and golden on top."},
            {"instruction": "Let it cool for a few minutes before slicing."},
            {"instruction": "Serve warm or at room temperature."}
        ]),
        tags="bacon, cheese, French, brunch, savory",
                owner_id=1,
        owner_username="little_chef",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe13 = Recipe(
        name="Soupe à l'Oignon",
        yield_servings=4,
        prep_time=15,
        cook_time=90,
        total_time=105,
        short_description="A rich and flavorful onion soup topped with melted cheese and served with toasted bread.",
        cuisine="French",
        description="Soupe à l'Oignon, or French Onion Soup, is the epitome of comfort food. This beloved French classic features slow-caramelized onions, which become sweet and rich in flavor, simmered in a savory beef broth enhanced with a touch of dry white wine, garlic, and aromatic herbs. The result is a deeply satisfying and heartwarming soup that is perfect for any occasion. The golden-brown onions, tender and packed with umami, form the base of the soup, while the addition of fresh thyme and bay leaf adds subtle depth. The crowning touch comes in the form of a slice of toasted baguette, perfectly crisped and then smothered in a generous layer of melted Gruyère cheese. When broiled, the cheese becomes golden and bubbly, creating a comforting layer that enhances the soup's texture and flavor. Ideal for cozy evenings, Soupe à l'Oignon is a dish that invites you to slow down and savor the simple pleasures of life. Serve with a warm, crusty baguette, and enjoy the perfect balance of sweetness from the caramelized onions and the savory richness of the broth and cheese.",
        ingredients=json.dumps([
            {"ingredient": "4 large onions, thinly sliced"},
            {"ingredient": "2 tablespoons unsalted butter"},
            {"ingredient": "1 tablespoon olive oil"},
            {"ingredient": "2 cloves garlic, minced"},
            {"ingredient": "4 cups beef broth"},
            {"ingredient": "1 cup dry white wine"},
            {"ingredient": "1 bay leaf"},
            {"ingredient": "1 teaspoon fresh thyme"},
            {"ingredient": "Salt and pepper to taste"},
            {"ingredient": "1 baguette, sliced into 1-inch pieces"},
            {"ingredient": "2 cups grated Gruyère cheese"},
        ]),
        instructions=json.dumps([
            {"instruction": "Heat butter and olive oil in a large pot over medium heat."},
            {"instruction": "Add onions and cook, stirring occasionally, until golden brown and caramelized, about 45 minutes."},
            {"instruction": "Add minced garlic and cook for another minute."},
            {"instruction": "Pour in the wine and scrape up any browned bits from the bottom of the pot."},
            {"instruction": "Add beef broth, bay leaf, thyme, salt, and pepper. Bring to a simmer and cook for 30 minutes."},
            {"instruction": "While the soup simmers, preheat the oven to 400°F (200°C)."},
            {"instruction": "Place the baguette slices on a baking sheet and toast in the oven until golden, about 10 minutes."},
            {"instruction": "Remove the bay leaf from the soup, and ladle soup into oven-safe bowls."},
            {"instruction": "Top each bowl with a slice of toasted baguette and grated Gruyère cheese."},
            {"instruction": "Place the bowls under the broiler for 3-5 minutes, until the cheese is melted and bubbly."},
            {"instruction": "Serve hot."}
        ]),
        tags="soup, French, comfort food, cheese, savory",
                owner_id=1,
        owner_username="little_chef",
        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe14 = Recipe(
        name="Madeleines",
        yield_servings=12,
        prep_time=10,
        cook_time=15,
        total_time=25,
        short_description="Small, shell-shaped sponge cakes with a delicate lemon flavor, perfect for afternoon tea.",
        cuisine="French",
        description="Madeleines are the quintessential French dessert, known for their light and airy texture, delicate flavor, and iconic shell-like shape. These small, sponge cakes are perfect for any occasion, especially when served with a cup of tea. Infused with a hint of lemon zest, they have a subtle citrusy brightness that complements their rich, buttery flavor. The batter is easy to prepare, with just a few basic ingredients such as flour, eggs, sugar, and butter, but it’s the technique that makes them special. The eggs are whipped with sugar until they form a pale, fluffy mixture, and the flour is gently folded in to maintain the airiness. Once baked, these madeleines turn golden-brown on the outside, with a soft, tender crumb inside. Best enjoyed warm, right out of the oven, or at room temperature, these delightful cakes melt in your mouth with every bite. Whether you're hosting an elegant afternoon tea or simply indulging in a sweet treat, Madeleines bring a touch of French sophistication to any moment.",
        ingredients=json.dumps([
            {"ingredient": "1 cup all-purpose flour"},
            {"ingredient": "1/2 cup unsalted butter, melted"},
            {"ingredient": "2 large eggs"},
            {"ingredient": "1/2 cup sugar"},
            {"ingredient": "1 teaspoon vanilla extract"},
            {"ingredient": "1 teaspoon lemon zest"},
            {"ingredient": "1/4 teaspoon baking powder"},
            {"ingredient": "Pinch of salt"},
        ]),
        instructions=json.dumps([
            {"instruction": "Preheat the oven to 375°F (190°C) and grease a madeleine pan."},
            {"instruction": "Whisk eggs and sugar together until pale and fluffy."},
            {"instruction": "Add the melted butter, vanilla, and lemon zest, and whisk until combined."},
            {"instruction": "Sift in the flour, baking powder, and salt, and fold gently until smooth."},
            {"instruction": "Spoon the batter into the madeleine pan, filling each mold about 2/3 full."},
            {"instruction": "Bake for 12-15 minutes, until golden and springy to the touch."},
            {"instruction": "Let the madeleines cool for a few minutes before removing from the pan."},
            {"instruction": "Serve warm or at room temperature."}
        ]),
        tags="dessert, French, tea time, sweet, lemon",
                owner_id=1,
        owner_username="little_chef",

        created_at=created_at_time,
        updated_at=created_at_time,
    )

    recipe15 = Recipe(
        name="Beef Wellington",
        yield_servings=6,
        prep_time=30,
        cook_time=60,
        total_time=90,
        short_description="A show-stopping classic British dish, featuring a tender beef fillet coated with mushrooms and wrapped in golden, flaky puff pastry.",
        cuisine="British",
        description="Beef Wellington is a rich and luxurious dish that is often associated with special occasions and fine dining. The centerpiece is a perfectly cooked beef tenderloin, which is coated with a flavorful mushroom duxelles and wrapped in layers of prosciutto. The beef is then encased in a golden, buttery puff pastry that crisps up beautifully when baked. The dish is known for its elegant appearance and complex flavors, making it a show-stopping entrée for any celebration or holiday meal. Served with a rich sauce or simple sides like roasted vegetables or mashed potatoes, Beef Wellington promises to impress your guests and leave them wanting more. The combination of tender, melt-in-your-mouth beef and the earthy, savory mushroom filling creates a balance of textures and flavors that are both comforting and sophisticated.",
        ingredients=json.dumps([
            {"ingredient": "1.5 pounds beef tenderloin (center-cut)"},
            {"ingredient": "2 tablespoons olive oil"},
            {"ingredient": "Salt and pepper to taste"},
            {"ingredient": "1 tablespoon Dijon mustard"},
            {"ingredient": "1/2 cup pâté (optional)"},
            {"ingredient": "1 pound mushrooms, finely chopped"},
            {"ingredient": "1/2 cup shallots, finely chopped"},
            {"ingredient": "2 cloves garlic, minced"},
            {"ingredient": "2 tablespoons butter"},
            {"ingredient": "1/4 cup dry white wine"},
            {"ingredient": "1 package puff pastry sheets (enough to fully wrap the beef)"},
            {"ingredient": "1 egg, beaten (for egg wash)"},
            {"ingredient": "4 slices prosciutto"},
            {"ingredient": "1 tablespoon fresh thyme leaves"},
        ]),
        instructions=json.dumps([
            {"instruction": "Preheat the oven to 400°F (200°C)."},
            {"instruction": "Season the beef tenderloin with salt and pepper, then sear in a hot pan with olive oil until browned on all sides, about 3-4 minutes per side."},
            {"instruction": "Remove the beef from the pan and brush with Dijon mustard. Let it cool."},
            {"instruction": "In the same pan, melt butter and cook the shallots, garlic, and mushrooms until the mushrooms release their moisture and it evaporates, about 10 minutes."},
            {"instruction": "Add white wine and thyme, and cook until the mixture is dry. Let the mushroom duxelles cool."},
            {"instruction": "Place the prosciutto slices on a sheet of plastic wrap, overlapping slightly. Spread the mushroom duxelles evenly over the prosciutto."},
            {"instruction": "Place the beef on top of the mushroom layer and roll it up tightly using the plastic wrap. Chill for 30 minutes."},
            {"instruction": "Roll out the puff pastry on a floured surface, and place the beef on top of it. Wrap the pastry around the beef, sealing the edges and brushing with the beaten egg."},
            {"instruction": "Place the wrapped beef on a baking sheet and brush the pastry with more egg wash."},
            {"instruction": "Bake for 40-50 minutes, until the pastry is golden and the beef reaches your desired level of doneness (120°F for rare, 130°F for medium-rare)."},
            {"instruction": "Let the Beef Wellington rest for 10 minutes before slicing."},
            {"instruction": "Serve hot, and enjoy!"}
        ]),
        tags="beef, gourmet, British, special occasion, pastry",
                owner_id=1,
        owner_username="little_chef",
        created_at=created_at_time,
        updated_at=created_at_time,
    )


    # Add the recipes to the session
    db.session.add(recipe1)
    db.session.add(recipe2)
    db.session.add(recipe3)
    db.session.add(recipe4)
    db.session.add(recipe5)
    db.session.add(recipe6)
    db.session.add(recipe7)
    db.session.add(recipe8)
    db.session.add(recipe9)
    db.session.add(recipe10)
    db.session.add(recipe11)
    db.session.add(recipe12)
    db.session.add(recipe13)
    db.session.add(recipe14)
    db.session.add(recipe15)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built-in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities. With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_recipes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.recipes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM recipes"))

    db.session.commit()
