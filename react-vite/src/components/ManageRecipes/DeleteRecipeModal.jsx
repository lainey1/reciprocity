import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteRecipe } from "../../redux/recipes";

function DeleteRecipeModal({ recipe_id, recipe_name }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(thunkDeleteRecipe(recipe_id)); // Ensure this returns a promise
      window.location.reload(); // Force reload after deletion
      closeModal();
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  return (
    <div className="page-form-container">
      <h3>Confirm Deletion</h3>
      <p>
        Are you sure you want to delete this recipe:{" "}
        <span style={{ fontWeight: "bold" }}>{recipe_name}</span>?
      </p>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={closeModal}>Cancel</button>
    </div>
  );
}

export default DeleteRecipeModal;
