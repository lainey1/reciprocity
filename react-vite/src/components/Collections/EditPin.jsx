import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateCollection from "../Collections/CreateCollection";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import { useModal } from "../../context/Modal";

import {
  addRecipe,
  removeRecipe,
  fetchCollections,
  fetchCollectionsByOwner,
} from "../../redux/collections";

import no_image_available from "../../../public/no_image_available.png";

import "./EditPin.css";

function EditPin({ recipeId, recipeName, recipeImage }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const userCollections = useSelector(
    (state) => state.collections?.ownerCollections
  );
  const userId = useSelector((state) => state.session.user.id);
  const currentCollection = useSelector(
    (state) => state.collections?.currentCollection
  );

  const [selectedCollection, setSelectedCollection] = useState(null);
  const [warning, setWarning] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
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
    setWarning(null);
  };

  const handleSaveRecipe = async () => {
    if (!selectedCollection) {
      alert("Please select a collection to save this recipe.");
      return;
    }

    // Find the selected collection by ID
    const collection = userCollections.find(
      (coll) => Number(coll.id) === Number(selectedCollection) // Ensure both are numbers
    );

    // If the collection is not found, handle gracefully
    if (!collection) {
      alert("Selected collection not found. Please try again.");
      return;
    }

    // Check if the recipe already exists in the collection
    const recipeExists = collection?.recipes?.some((r) => r.id === recipeId);

    if (recipeExists) {
      setWarning("This recipe is already in the selected collection.");
      return;
    }

    // Save recipe to collection
    await dispatch(addRecipe(selectedCollection, recipeId));
    dispatch(fetchCollectionsByOwner(userId));

    // Set success message
    setSuccessMessage(`Added to "${collection.name}" collection!`);
  };

  const handleRemoveRecipe = async () => {
    await dispatch(removeRecipe(currentCollection.id, recipeId));
    dispatch(fetchCollectionsByOwner(userId));

    setSuccessMessage(`Removed from "${currentCollection.name}" collection!`);
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        closeModal();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, closeModal]);

  return (
    <div className="page-form-container">
      <form>
        <div>
          <h2>{recipeName}</h2>
          <div className="recipe-pin-image">
            {recipeImage ? (
              <img src={recipeImage} alt={`${recipeName} image`} />
            ) : (
              <img src={no_image_available} alt="no image available" />
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
          {warning && <p className="warning">{warning}</p>}
        </div>

        <button type="button" onClick={handleSaveRecipe}>
          Add to Collection
        </button>
        <button type="button" onClick={handleRemoveRecipe}>
          Remove From Collection
        </button>
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
      </form>

      {successMessage && (
        <div className="success-popup">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default EditPin;
