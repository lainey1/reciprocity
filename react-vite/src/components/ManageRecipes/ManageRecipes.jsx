import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaEdit, FaMinusCircle } from "react-icons/fa";

import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteRecipeModal from "./DeleteRecipeModal";
import no_image_available from "../../../public/no_image_available.png";

import { thunkFetchRecipes } from "../../redux/recipes";

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
          <FaEdit /> Create Recipe
        </button>
      </div>

      {/* Conditional rendering for empty recipes */}
      {userRecipes.length === 0 ? (
        <div className="image-tile">
          <p>You haven&apos;t created any recipes yet...</p>
        </div>
      ) : (
        <div className="images-grid">
          {userRecipes.map((recipe) => (
            <div key={recipe.id} className="image-tile">
              <Link to={`/recipes/${recipe.id}`} className="recipe-link">
                <div className="image-tile-container">
                  {recipe.preview_image ? (
                    <img src={recipe.preview_image} />
                  ) : (
                    <img src={no_image_available} alt="no image available" />
                  )}
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="image-tile-action-buttons">
                <OpenModalButton
                  buttonText={
                    <>
                      <FaMinusCircle /> Delete
                    </>
                  }
                  id="delete-button"
                  modalComponent={
                    <DeleteRecipeModal
                      recipe_id={recipe.id}
                      recipe_name={recipe.name}
                      owner_id={currentUser.id}
                    />
                  }
                />

                <button
                  className="edit-button"
                  onClick={() => navigate(`/recipes/${recipe.id}/`)}
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
