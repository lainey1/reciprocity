import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteRecipeModal from "./DeleteRecipeModal";
import no_image_available from "../../../public/no_image_available.png";

import { thunkFetchRecipes } from "../../redux/recipes";

import "./RecipeTiles.css";

function ManageRecipes() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const recipes = useSelector((state) => state.recipes.recipes);
  const currentUser = useSelector((state) => state.session.user);
  const recipesArr = Object.values(recipes);

  const userRecipes = recipesArr?.filter(
    (recipe) => recipe.owner_id === currentUser?.id
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    dispatch(thunkFetchRecipes());
  }, [dispatch]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRecipeToDelete(null);
  };

  if (!currentUser) {
    return <div>You must be logged in to manage recipes.</div>;
  }

  return (
    <div>
      <div id="manage-recipe-buttons">
        <button onClick={() => navigate("/recipes/new")} className="add-button">
          Create Recipe
        </button>
      </div>

      {/* Conditional rendering for empty recipes */}
      {userRecipes.length === 0 ? (
        <div className="recipe-tile">
          <p>You haven&apos;t created any recipes yet...</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {userRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-tile">
              <div className="image-tile">
                <Link to={`/recipes/${recipe.id}`} className="recipe-link">
                  <div className="recipe-image-container">
                    {recipe.preview_image ? (
                      <img
                        src={recipe.preview_image}
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
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="recipe-action-buttons">
                <OpenModalButton
                  buttonText="Delete"
                  id="delete-button"
                  modalComponent={
                    <DeleteRecipeModal
                      recipe_id={recipe.id}
                      recipe_name={recipe.name}
                    />
                  }
                />

                <button
                  className="edit-button"
                  onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                >
                  <FaEdit /> Edit
                </button>
              </div>

              <div>
                <p className="recipe-tile-name">{recipe.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conditional Modal Rendering */}
      {isModalOpen && (
        <DeleteRecipeModal
          recipeId={recipeToDelete}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default ManageRecipes;
