import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useModal } from "../../context/Modal";
import { editCollection, fetchCollectionById } from "../../redux/collections";

const EditCollection = ({ collection_id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();

  // Selector to fetch the specific collection by ID
  const currentCollection = useSelector(
    (state) => state.collections?.currentCollection
  );

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Fetch collection data on component mount
  useEffect(() => {
    dispatch(fetchCollectionById(collection_id));
  }, [dispatch, collection_id]);

  // Update form data when collection is fetched
  useEffect(() => {
    if (currentCollection) {
      setFormData({
        name: currentCollection?.name || "",
        description: currentCollection?.description || "",
      });
    }
  }, [currentCollection]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.trimStart(),
    }));
  };

  // Handle form submission
  const postCollection = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
      };

      await dispatch(editCollection(currentCollection.id, payload));
      navigate(`/collections/${collection_id}`);
      closeModal();
    } catch (error) {
      console.error("Failed to update collection:", error);
      setErrors({ form: "Failed to update the collection. Please try again." });
    }
  };

  return (
    <div>
      <div className="form-header">
        <h2>Edit Collection</h2>
      </div>

      <form onSubmit={postCollection}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </label>

        <div className="form-buttons">
          <button type="submit">Update Collection</button>
        </div>
        {errors.form && <span className="error-message">{errors.form}</span>}
      </form>
    </div>
  );
};

export default EditCollection;
