import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteRecipe } from "../../redux/recipes";
import { fetchCollectionsByOwner } from "../../redux/collections";

function DeleteRecipeModal({ recipe_id, recipe_name, owner_id }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = () => {
    try {
      dispatch(thunkDeleteRecipe(recipe_id));
      dispatch(fetchCollectionsByOwner(owner_id));
      closeModal();
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  return (
    <div className="page-form-container">
      <form>
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete this recipe:{" "}
          <span style={{ fontWeight: "bold" }}>{recipe_name}</span>?
        </p>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={closeModal}>Cancel</button>
      </form>
    </div>
  );
}

export default DeleteRecipeModal;
