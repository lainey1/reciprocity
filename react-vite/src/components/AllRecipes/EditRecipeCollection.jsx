import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateCollection from "../Collections/CreateCollection";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useModal } from "../../context/Modal";

import {
  addRecipe,
  fetchCollections,
  fetchCollectionsByOwner,
} from "../../redux/collections";

import no_image_available from "../../../public/no_image_available.png";

function EditRecipeCollection({ recipeId, recipeName, recipeImage }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const userCollections = useSelector(
    (state) => state.collections?.ownerCollections
  );
  const userId = useSelector((state) => state.session.user.id);

  const [selectedCollection, setSelectedCollection] = useState(null);
  const [warning, setWarning] = useState(null); // State for warning message
  const [successMessage, setSuccessMessage] = useState(null); // State for success message popup
  const initialFetchCompleted = useRef(false);

  useEffect(() => {
    dispatch(fetchCollections());
    dispatch(fetchCollectionsByOwner(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userCollections.length > 0 && !initialFetchCompleted.current) {
      const existingCollection = userCollections
        .filter((collection) =>
          collection?.recipes?.some((r) => r.id === recipeId)
        )
        .map((collection) => collection.id);

      if (existingCollection.length > 0) {
        setSelectedCollection(existingCollection[0]);
      }

      initialFetchCompleted.current = true;
    }
  }, [userCollections, recipeId]);

  const handleCollectionChange = (collectionId) => {
    setSelectedCollection(collectionId);
    setWarning(null); // Reset warning when user selects a new collection
  };

  const handleSaveRecipe = async () => {
    if (!selectedCollection) {
      alert("Please select a collection to save this recipe.");
      return;
    }

    // Check if recipe already exists in the selected collection
    const collection = userCollections.find(
      (coll) => coll.id === selectedCollection
    );
    const recipeExists = collection?.recipes?.some((r) => r.id === recipeId);

    if (recipeExists) {
      setWarning("This recipe is already in the selected collection.");
      return; // Don't save if recipe already exists
    }

    dispatch(addRecipe(selectedCollection, recipeId));
    dispatch(fetchCollectionsByOwner(userId));

    // Find the collection by id and get the name
    const collectionName = userCollections.find(
      (coll) => coll.id === selectedCollection
    )?.name;

    if (collectionName) {
      setSuccessMessage(`Added to "${collectionName}" collection!`);
    } else {
      setSuccessMessage("Recipe saved successfully!");
    }

    setTimeout(() => {
      setSuccessMessage(null);
      closeModal();
    }, 3000);
  };

  return (
    <div className="save-recipe-container">
      <div>
        <h2>{recipeName}</h2>
        <div className="recipe-image-container">
          {recipeImage ? (
            <img
              src={recipeImage}
              alt={`${recipeName} image`}
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
        <p>Select a Collection:</p>
        <select
          onChange={(e) => handleCollectionChange(e.target.value)}
          value={selectedCollection || ""}
        >
          <option value="" disabled>
            Choose a collection
          </option>
          {userCollections?.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>
        {warning && <p className="warning">{warning}</p>}{" "}
        {/* Display warning */}
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
      <button onClick={handleSaveRecipe}>Save to Collection</button>

      {/* Success message popup */}
      {successMessage && (
        <div className="success-popup">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default EditRecipeCollection;
