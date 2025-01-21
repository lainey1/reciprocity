import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CreateCollection from "./CreateCollection";
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

    const collection = userCollections.find(
      (coll) => coll.id === selectedCollection
    );
    const recipeExists = collection?.recipes?.some((r) => r.id === recipeId);

    if (recipeExists) {
      setWarning("This recipe is already in the selected collection.");
      return;
    }

    dispatch(addRecipe(selectedCollection, recipeId));
    dispatch(fetchCollectionsByOwner(userId));

    const collectionName = userCollections.find(
      (coll) => coll.id === selectedCollection
    )?.name;

    if (collectionName) {
      setSuccessMessage(`Added to "${collectionName}" collection!`);
    } else {
      setSuccessMessage("Recipe saved successfully!");
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        closeModal();
      }, 1000);

      return () => clearTimeout(timer); // Cleanup timeout on component unmount or re-render
    }
  }, [successMessage, closeModal]);

  return (
    <div className="save-recipe-container">
      <form>
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
          {warning && <p className="warning">{warning}</p>}
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
        <button type="button" onClick={handleSaveRecipe}>
          Save to Collection
        </button>
      </form>

      {successMessage && (
        <div className="success-popup">
          <p>{successMessage}</p>
        </div>
      )}
    </div>
  );
}

export default EditRecipeCollection;
