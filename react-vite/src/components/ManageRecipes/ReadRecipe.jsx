import { useEffect, useState } from "react";
import { MdAddAPhoto, MdOutlineAddAPhoto } from "react-icons/md";
import { TbPhotoEdit } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

import noImage from "../../../public/no_image_available.png";
import logo from "../../../public/reciprocity_logo.png";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import UpdateRecipeImages from "./UpdateRecipeImages";
import UploadRecipeImage from "./UploadRecipeImage";

import "./ReadRecipe.css";

const RecipeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const currentUser = useSelector((state) => state.session?.user);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [ingredientsExpanded, setIngredientsExpanded] = useState(false);
  const [instructionsExpanded, setInstructionsExpanded] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the recipe.");
        }
        const data = await response.json();
        setRecipe(data.recipe);

        // Find the index of the preview image and set it as the initial index
        const previewImageIndex = data.recipe.images.findIndex(
          (image) => image.is_preview
        );
        if (previewImageIndex !== -1) {
          setCurrentImageIndex(previewImageIndex);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === recipe.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? recipe.images.length - 1 : prevIndex - 1
    );
  };

  const toggleIngredients = () => setIngredientsExpanded((prev) => !prev);
  const toggleInstructions = () => setInstructionsExpanded((prev) => !prev);

  if (loading) {
    return <img src={logo} alt="Loading..." className="logo-spinner" />;
  }

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recipe-details-container">
      <div id="panel">
        {recipe ? (
          <div className="recipe-info">
            <span className="detail-main">
              <div className="left-side">
                <div id="recipe-photo-box">
                  <div className="image-slider">
                    <button
                      className="prev-button"
                      onClick={handlePreviousImage}
                      disabled={!recipe.images || recipe.images.length === 0}
                    >
                      &#60;
                    </button>
                    <div className="image-container">
                      {recipe.images && recipe.images.length > 0 ? (
                        <img
                          src={recipe.images[currentImageIndex].image_url}
                          alt={`Recipe image ${currentImageIndex + 1}`}
                        />
                      ) : (
                        <div className="placeholder">
                          {!currentUser ||
                          currentUser.id !== recipe.owner_id ? (
                            <img src={noImage} alt="no image available" />
                          ) : (
                            <>
                              <MdAddAPhoto className="add-photo-icon" />
                              <p className="add-photo-text">Add Photo</p>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      className="next-button"
                      onClick={handleNextImage}
                      disabled={!recipe.images || recipe.images.length === 0}
                    >
                      &#62;
                    </button>
                  </div>
                  {currentUser && currentUser.id == recipe.owner_id && (
                    <div id="recipe-action-buttons">
                      <OpenModalButton
                        buttonText={
                          <>
                            <MdOutlineAddAPhoto className="add-edit-photo-icon" />
                            {"  "}
                            Add Photo
                          </>
                        }
                        modalComponent={
                          <UploadRecipeImage recipeId={recipe.id} />
                        }
                      />
                      <OpenModalButton
                        buttonText={
                          <>
                            <TbPhotoEdit className="add-edit-photo-icon" />
                            {"  "}
                            Edit Photos
                          </>
                        }
                        modalComponent={
                          <UpdateRecipeImages
                            recipeId={recipe.id}
                            images={recipe.recipe_images}
                          />
                        }
                      />
                      <button
                        onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                      >
                        <FaEdit />
                        Edit Recipe
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="right-side">
                <div className="recipe-details">
                  <h2 className="recipe-name">{recipe.name}</h2>
                  <p>
                    <em>Created by: {recipe.owner}</em>
                  </p>
                  <br />
                  <p>
                    <strong>Cuisine:</strong> {recipe.cuisine}
                  </p>
                  <p>
                    <strong>Yield:</strong> {recipe.yield_servings} servings
                  </p>
                  <p>
                    <strong>Prep Time:</strong> {recipe.prep_time} minutes
                  </p>
                  <p>
                    <strong>Cook Time:</strong> {recipe.cook_time} minutes
                  </p>
                  <p>
                    <strong>Total Time:</strong> {recipe.total_time} minutes
                  </p>
                  {recipe.tags && (
                    <p>
                      <strong>Tags:</strong> {recipe.tags}
                    </p>
                  )}
                  <h3>Description</h3>
                  <p>{recipe.description}</p>

                  <h3 onClick={toggleIngredients} className="collapsible">
                    Ingredients{" "}
                    {ingredientsExpanded ? (
                      <MdExpandLess size={30} />
                    ) : (
                      <MdExpandMore size={30} />
                    )}
                  </h3>
                  {ingredientsExpanded && (
                    <ul>
                      {recipe.ingredients.map((item, index) => (
                        <li key={index}>{item.ingredient}</li>
                      ))}
                    </ul>
                  )}

                  <h3 onClick={toggleInstructions} className="collapsible">
                    Instructions{" "}
                    {instructionsExpanded ? (
                      <MdExpandLess size={30} />
                    ) : (
                      <MdExpandMore size={30} />
                    )}
                  </h3>
                  {instructionsExpanded && (
                    <ol>
                      {recipe.instructions.map((step, index) => (
                        <li key={index}>{step.instruction}</li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </span>
          </div>
        ) : (
          <p>Recipe not found.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;
