import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import no_image_available from "../../../public/no_image_available.png";
import { addRecipe, fetchCollectionsByOwner } from "../../redux/collections";
import { thunkFetchRecipes } from "../../redux/recipes";

import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateCollection from "../Collections/CreateCollection";

import "./AllRecipes.css";

function AllRecipes() {
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes?.recipes);
  const userCollections = useSelector(
    (state) => state.collections.ownerCollections
  );
  const userId = useSelector((state) => state.session.user.id);

  const recipesArr = Object.values(recipes);

  // Store selected collections by recipe ID (as arrays)
  const [selectedCollections, setSelectedCollections] = useState({});
  const initialFetchCompleted = useRef(false);

  useEffect(() => {
    dispatch(thunkFetchRecipes());
    dispatch(fetchCollectionsByOwner(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    // Only update selectedCollections once after the initial fetch
    if (userCollections.length > 0 && !initialFetchCompleted.current) {
      const updatedSelectedCollections = {};
      recipesArr.forEach((recipe) => {
        const existingCollections = userCollections
          .filter((collection) =>
            collection?.recipes?.some((r) => r.id === recipe.id)
          )
          .map((collection) => collection.id);

        if (existingCollections.length > 0) {
          updatedSelectedCollections[recipe.id] = existingCollections;
        }
      });

      setSelectedCollections((prevState) => {
        const hasChanges = Object.keys(updatedSelectedCollections).some(
          (key) =>
            updatedSelectedCollections[key].toString() !==
            prevState[key]?.toString()
        );
        if (hasChanges) {
          return updatedSelectedCollections;
        }
        return prevState;
      });

      initialFetchCompleted.current = true;
    }
  }, [userCollections, recipesArr]);

  const handleCollectionChange = (recipeId, collectionId, isChecked) => {
    setSelectedCollections((prevState) => {
      const updatedSelections = prevState[recipeId] || [];

      if (isChecked) {
        // Add collection ID to selected collections
        updatedSelections.push(collectionId);
      } else {
        // Remove collection ID from selected collections
        const index = updatedSelections.indexOf(collectionId);
        if (index > -1) {
          updatedSelections.splice(index, 1);
        }
      }

      return {
        ...prevState,
        [recipeId]: updatedSelections,
      };
    });
  };

  const handleSaveRecipe = (recipeId) => {
    const collectionIds = selectedCollections[recipeId];
    if (!collectionIds || collectionIds.length === 0) {
      alert("Please select at least one collection to save this recipe.");
      return;
    }
    // Save to each selected collection
    collectionIds.forEach((collectionId) => {
      dispatch(addRecipe(collectionId, recipeId));
      dispatch(fetchCollectionsByOwner(userId));
    });
  };

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
              <div>
                <p>Select Collections:</p>
                {userCollections?.map((collection) => (
                  <div key={collection.id}>
                    <label>
                      <input
                        type="checkbox"
                        value={collection.id}
                        checked={selectedCollections[recipe.id]?.includes(
                          collection.id
                        )}
                        onChange={(e) =>
                          handleCollectionChange(
                            recipe.id,
                            collection.id,
                            e.target.checked
                          )
                        }
                      />
                      {collection.name}
                    </label>
                  </div>
                ))}
              </div>
              <OpenModalButton
                buttonText="Create Collection"
                id="create-collection"
                modalComponent={
                  <CreateCollection
                    collection_id={userCollections.id}
                    collection_name={userCollections.name}
                  />
                }
              />
              <button onClick={() => handleSaveRecipe(recipe.id)}>
                Save to Collection
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllRecipes;
