// react-vite/src/components/ManageRecipes/CreateRecipe.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FaPlus, FaMinus } from "react-icons/fa6";

import { initialFormData, validateAllRecipeFields } from "./utils";
import {
  thunkCreateRecipe,
  // thunkFetchRecipeById,
  thunkFetchRecipes,
} from "../../redux/recipes";

import "./CreateRecipe.css";

const CreateRecipe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  // const [flashMessage, setFlashMessage] = useState("");
  // const [showFlash, setShowFlash] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (value >= 0 || value === "") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Add ingredient/instruction dynamically
  const addField = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: [...prevData[fieldName], ""],
    }));
  };

  // Function to remove an item from a dynamic field
  const removeField = (index, fieldName) => {
    setFormData((prevData) => {
      const updatedField = [...prevData[fieldName]];
      updatedField.splice(index, 1); // Remove the item at the specified index
      return {
        ...prevData,
        [fieldName]: updatedField,
      };
    });
  };

  // Update dynamic fields
  const handleDynamicChange = (index, fieldName, value) => {
    setFormData((prevData) => {
      const updatedField = [...prevData[fieldName]];
      updatedField[index] = value;
      return {
        ...prevData,
        [fieldName]: updatedField,
      };
    });
  };

  // Validate form and display errors
  const validateForm = () => {
    const fieldErrors = validateAllRecipeFields(formData);
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0; // Return true if no errors
  };

  // Handlers for Save Draft, Post Recipe, Cancel
  // Add flash message logic to saveDraft
  // const saveDraft = () => {
  //   setFlashMessage("Feature Coming Soon");
  //   setShowFlash(true);

  //   // Hide the flash message after 3 seconds
  //   setTimeout(() => {
  //     setShowFlash(false);
  //   }, 3000);
  // };

  const postRecipe = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const filteredFormData = {
        ...formData,
        ingredients: formData.ingredients.filter(
          (ingredient) => ingredient.trim() !== ""
        ),
        instructions: formData.instructions.filter(
          (instruction) => instruction.trim() !== ""
        ),
      };

      try {
        const data = await dispatch(thunkCreateRecipe(filteredFormData));
        dispatch(thunkFetchRecipes());
        navigate(`/recipes/${data.id}`);
      } catch (error) {
        console.error("Failed to update recipe:", error);
      }
    }
  };

  const cancel = () => {
    console.log("Recipe Creation Cancelled");
    setFormData({
      name: "",
      yield_servings: "",
      prep_time: "",
      cook_time: "",
      total_time: "",
      cuisine: "",
      short_description: "",
      description: "",
      ingredients: [""],
      instructions: [""],
      tags: "",
    });
  };

  return (
    <div className="form-page-container">
      <div>
        <h2>Create Recipe</h2>
      </div>

      <form>
        <label>
          Recipe Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </label>
        <div className="two-columns">
          <div className="form-column">
            <label>
              Prep Time (minutes)
              <input
                type="number"
                name="prep_time"
                value={formData.prep_time}
                onChange={handleNumberChange}
              />
              {errors.prep_time && (
                <span className="error-message">{errors.prep_time}</span>
              )}
            </label>

            <label>
              Cook Time (minutes)
              <input
                type="number"
                name="cook_time"
                value={formData.cook_time}
                onChange={handleNumberChange}
              />
              {errors.cook_time && (
                <span className="error-message">{errors.cook_time}</span>
              )}
            </label>

            <label>
              Total Time (minutes)
              <input
                type="number"
                name="total_time"
                value={formData.total_time}
                onChange={handleNumberChange}
              />
              {errors.total_time && (
                <span className="error-message">{errors.total_time}</span>
              )}
            </label>
          </div>
          <div className="form-column">
            <label>
              Servings
              <input
                type="number"
                name="yield_servings"
                value={formData.yield_servings}
                onChange={handleNumberChange}
              />
              {errors.yield_servings && (
                <span className="error-message">{errors.yield_servings}</span>
              )}
            </label>

            <label>
              Cuisine:
              <select
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
              >
                <option value="">Select Cuisine</option>
                <option value="American">American</option>
                <option value="Argentinian">Argentinian</option>
                <option value="Brazilian">Brazilian</option>
                <option value="British">British</option>
                <option value="Caribbean">Caribbean</option>
                <option value="Chinese">Chinese</option>
                <option value="Colombian">Colombian</option>
                <option value="Ethiopian">Ethiopian</option>
                <option value="Filipino">Filipino</option>
                <option value="French">French</option>
                <option value="Fusion">Fusion</option>
                <option value="German">German</option>
                <option value="Greek">Greek</option>
                <option value="Indian">Indian</option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Korean">Korean</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Mexican">Mexican</option>
                <option value="Middle Eastern">Middle Eastern</option>
                <option value="Moroccan">Moroccan</option>
                <option value="Nigerian">Nigerian</option>
                <option value="Peruvian">Peruvian</option>
                <option value="South African">South African</option>
                <option value="Spanish">Spanish</option>
                <option value="Thai">Thai</option>
                <option value="Vietnamese">Vietnamese</option>
                <option value="Other">Other</option>
              </select>
              {errors.cuisine && (
                <span className="error-message">{errors.cuisine}</span>
              )}
            </label>
          </div>
        </div>

        <label>
          Short Description
          <input
            type="text"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
          />
          {errors.short_description && (
            <span className="error-message">{errors.short_description}</span>
          )}
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </label>

        <h3>Ingredients</h3>
        {formData.ingredients.map((ingredient, index) => (
          <span key={index} className="add-delete-row">
            <input
              type="text"
              value={ingredient}
              onChange={(e) =>
                handleDynamicChange(index, "ingredients", e.target.value)
              }
            />
            <span>
              <button
                type="button"
                onClick={() => removeField(index, "ingredients")}
                style={{ marginLeft: "10px" }}
              >
                <FaMinus />
              </button>
              <button type="button" onClick={() => addField("ingredients")}>
                <FaPlus />
              </button>
            </span>
          </span>
        ))}

        <h3>Instructions</h3>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="add-delete-row">
            <input
              type="text"
              value={instruction}
              onChange={(e) =>
                handleDynamicChange(index, "instructions", e.target.value)
              }
            />
            <span>
              <button
                type="button"
                onClick={() => removeField(index, "instructions")}
                style={{ marginLeft: "10px" }}
              >
                <FaMinus />
              </button>
              <button type="button" onClick={() => addField("instructions")}>
                <FaPlus />
              </button>
            </span>
          </div>
        ))}

        <label>
          Tags
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </label>

        {/* {showFlash && <div className="flash-message">{flashMessage}</div>} */}

        <div className="form-buttons">
          <button type="button" onClick={postRecipe}>
            Post Recipe
          </button>
          <button type="reset" onClick={() => setFormData(initialFormData)}>
            Reset
          </button>

          <button type="button" onClick={cancel}>
            Cancel
          </button>
        </div>
        <br />
        <hr />
      </form>
    </div>
  );
};

export default CreateRecipe;
