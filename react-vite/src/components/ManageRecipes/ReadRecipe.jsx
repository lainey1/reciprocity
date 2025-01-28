import { useEffect, useState } from "react";
import { MdOutlineAddAPhoto } from "react-icons/md";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import noImage from "../../../public/no_image_available.png";
import logo from "../../../public/reciprocity_logo.png";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ImageUpload from "./ImageUpload";
import "./ReadRecipe.css";

const RecipeDetails = () => {
  const { id } = useParams();

  const currentUser = useSelector((state) => state.session?.user);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`/api/recipes/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the recipe.");
        }
        const data = await response.json();
        setRecipe(data.recipe);
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

  if (loading) {
    return <img src={logo} alt="Loading..." className="logo-spinner" />;
  }

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="recipe-details-container">
      <div>
        {recipe ? (
          <div className="recipe-info">
            <h2 className="recipe-name">{recipe.name}</h2>
            <span className="detail-main">
              <div className="left-side">
                <div className="image-slider">
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
                              <MdOutlineAddAPhoto className="add-photo-icon" />
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
                </div>

                {currentUser.id == recipe.owner_id && (
                  <div>
                    <OpenModalButton
                      buttonText={
                        <>
                          <MdOutlineAddAPhoto className="add-photo-icon" /> Add
                          Photo
                        </>
                      }
                      id="delete-button"
                      modalComponent={<ImageUpload recipe_id={recipe.id} />}
                    />
                  </div>
                )}

                <div className="recipe-highlights">
                  <p>
                    <em>Created by: {recipe.owner}</em>
                  </p>
                  <br />
                  <hr />
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
                </div>
              </div>

              <div className="right-side">
                <h3>Description</h3>
                <p>{recipe.description}</p>
                <h3>Ingredients</h3>
                <ul className="ingredients-list">
                  {recipe.ingredients.map((item, index) => (
                    <li key={index}>{item.ingredient}</li>
                  ))}
                </ul>

                <h3>Instructions</h3>
                <ol className="instructions-list">
                  {recipe.instructions.map((step, index) => (
                    <li key={index}>{step.instruction}</li>
                  ))}
                </ol>
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
