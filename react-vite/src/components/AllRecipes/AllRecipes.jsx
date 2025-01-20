import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import no_image_available from "../../../public/no_image_available.png";
import { thunkFetchRecipes } from "../../redux/recipes";

import OpenModalButton from "../OpenModalButton/OpenModalButton";

import SaveRecipeToCollection from "./EditRecipeCollection";

import "./AllRecipes.css";

function AllRecipes() {
  const dispatch = useDispatch();

  const recipes = useSelector((state) => state.recipes?.recipes);
  const recipesArr = Object.values(recipes);

  useEffect(() => {
    dispatch(thunkFetchRecipes());
  }, [dispatch]);

  return (
    <div id="all-recipes-page-container">
      <div className="all-recipes-grid">
        {recipesArr.map((recipe) => (
          <div key={recipe.id} className="recipe-tile">
            <Link to={`${recipe.id}`} className="all-recipes-link">
              <div className="recipe-image-container">
                {recipe.preview_image ? (
                  <img
                    src={recipe.preview_image}
                    alt={`${recipe.name} image`}
                    className="recipe-image"
                  />
                ) : (
                  <img
                    src={no_image_available}
                    alt="no image available"
                    className="recipe-image"
                  />
                )}
              </div>
              <div className="recipe-highlight">
                <p className="recipe-description">
                  <span style={{ fontWeight: "bold" }}>{recipe.name}</span>{" "}
                  {recipe.short_description}
                </p>
              </div>
            </Link>
            {/* Save button and collection selection */}
            <div className="save-recipe-container">
              <OpenModalButton
                buttonText="Save"
                id="save-collection-button"
                modalComponent={
                  <SaveRecipeToCollection
                    recipeId={recipe.id}
                    recipeName={recipe.name}
                    recipeImage={recipe.preview_image}
                  />
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllRecipes;
