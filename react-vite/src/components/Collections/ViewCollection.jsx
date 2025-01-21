import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import no_image_available from "../../../public/no_image_available.png";
import { fetchCollectionById } from "../../redux/collections";
import DeleteRecipeModal from "../ManageRecipes/DeleteRecipeModal";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditPin from "./EditPin";

const ViewCollection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { collection_id } = useParams();

  const collectionRecipes = useSelector(
    (state) => state.collections?.currentCollection?.recipes
  );
  const currentUser = useSelector((state) => state.session?.user);
  const currentCollection = useSelector(
    (state) => state.collections?.currentCollection
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchCollectionById(collection_id));
  }, [dispatch, collection_id]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRecipeToDelete(null);
  };

  return (
    <div className="page-container">
      <h2>{currentCollection?.name}</h2>
      <div className="images-grid">
        {/* Conditional rendering for empty collections */}
        {!collectionRecipes || collectionRecipes.length === 0 ? (
          <div className="image-tile">
            <p>There aren’t any recipes in this collection yet...</p>
          </div>
        ) : (
          collectionRecipes.map((recipe) => (
            <div key={recipe.id} className="image-tile">
              <Link to={`/recipes/${recipe.id}`} className="recipe-link">
                <div className="image-tile-container">
                  {recipe?.preview_image ? (
                    <img src={recipe.preview_image} />
                  ) : (
                    <img src={no_image_available} alt="no image available" />
                  )}
                </div>
              </Link>

              <div>
                {currentUser?.id === recipe.owner_id ? (
                  <div className="image-tile-action-buttons">
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
                ) : (
                  <div className="image-tile-action-buttons">
                    <OpenModalButton
                      buttonText="Edit Pin"
                      id="edit-button"
                      modalComponent={
                        <EditPin
                          recipeId={recipe.id}
                          recipeName={recipe.name}
                          recipeImage={recipe.preview_image}
                        />
                      }
                    />
                  </div>
                )}
              </div>
              <div>
                <p className="recipe-tile-name">{recipe.name}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Conditional Modal Rendering */}
      {isModalOpen && (
        <DeleteRecipeModal
          recipeId={recipeToDelete}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ViewCollection;
