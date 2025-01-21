import { useState } from "react";
import { useDispatch } from "react-redux";

import { useModal } from "../../context/Modal";

import { createNewCollection } from "../../../src/redux/collections";

const CreateCollection = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  const handleCreate = () => {
    const payload = {
      name: newCollectionName,
      description: newCollectionDescription,
    };
    dispatch(createNewCollection(payload));
    setNewCollectionName("");
    setNewCollectionDescription("");
    closeModal();
  };

  return (
    <div>
      {/* Create New Collection */}
      <div className="create-collection">
        <h2>Create New Collection</h2>
        <form>
          <label>
            Name
            <input
              type="text"
              // placeholder="name your collection something memorable"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              // placeholder="Collection Description"
              value={newCollectionDescription}
              onChange={(e) => setNewCollectionDescription(e.target.value)}
            ></textarea>
          </label>
          <button onClick={handleCreate}>Create Collection</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCollection;
