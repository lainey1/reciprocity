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

    const collection = userCollections.find(
      (coll) => coll.id === selectedCollection
    );
    const recipeExists = collection?.recipes?.some((r) => r.id === recipeId);

    if (recipeExists) {
      setWarning("This recipe is already in the selected collection.");
      return;
    }

    await dispatch(addRecipe(selectedCollection, recipeId));
    dispatch(fetchCollectionsByOwner(userId));

    const collectionName = collection?.name;

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

  const handleRemoveRecipe = async () => {
    await dispatch(removeRecipe(currentCollection.id, recipeId));
    dispatch(fetchCollectionsByOwner(userId));

    const collectionName = currentCollection.name;

    if (collectionName) {
      setSuccessMessage(`Removed from "${collectionName}" collection!`);
    } else {
      setSuccessMessage("Recipe removed successfully!");
    }

    setTimeout(() => {
      setSuccessMessage(null);
      closeModal();
    }, 3000);
  };

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

        <button onClick={handleSaveRecipe}>Add to Collection</button>
        <button onClick={handleRemoveRecipe}>Remove From Collection</button>
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
