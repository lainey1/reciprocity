import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { thunkFetchRecipes } from "../../redux/recipes";
import no_image_available from "../../../public/no_image_available.png";

function AllRecipes() {
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes?.recipes);
  const recipesArr = Object.values(recipes);

  useEffect(() => {
    dispatch(thunkFetchRecipes());
  }, [dispatch]);

  return (
    <div id="all-recipes-page-container">
      <div className="recipes-grid">
        {recipesArr.map((recipe) => {
          return (
            <div key={recipe.id} className="recipe-tile">
              <Link to={`${recipe.id}`} className="recipe-link">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AllRecipes;
