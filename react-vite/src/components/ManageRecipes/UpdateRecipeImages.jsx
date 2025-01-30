import { useState } from "react";
import { useModal } from "../../context/Modal";

const UpdateRecipeImages = ({ images, recipeId }) => {
  const [selectedPreview, setSelectedPreview] = useState(
    images.find((image) => image.is_preview)?.id || null
  );
  const [submitMessage, setSubmitMessage] = useState(""); // New state for message
  const { closeModal } = useModal();

  const handleCheckboxChange = (imageId) => {
    setSelectedPreview(imageId);
  };

  const handleDelete = async (imageId) => {
    setSubmitMessage(""); // Reset the message before submitting

    try {
      const response = await fetch(`/api/recipe_images/${imageId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setSubmitMessage("Image deleted successfully!");
    } catch (error) {
      console.error("Error deleting image", error);
      setSubmitMessage("An error occurred while deleting the image.");
    }
  };

  const handleSubmit = async () => {
    setSubmitMessage(""); // Reset the message before submitting

    if (!selectedPreview) {
      setSubmitMessage("Please select a preview image.");
      return;
    }

    try {
      const response = await fetch(
        `/api/recipe_images/recipe/${recipeId}/set-preview`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_id: selectedPreview }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update preview image");
      }

      setSubmitMessage("Preview image updated successfully!");
    } catch (error) {
      console.error("Error updating preview image", error);
      setSubmitMessage("An error occurred while updating the preview image.");
    }
  };

  return (
    <div>
      <h3>Select a Preview Image or Delete an Image</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {images.map((image) => (
          <div key={image.id} style={{ display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={selectedPreview === image.id}
              onChange={() => handleCheckboxChange(image.id)}
            />
            <img
              src={image.image_url}
              alt={image.caption || "Recipe Image"}
              style={{ width: 100, marginLeft: 10 }}
            />
            <button
              type="button"
              onClick={() => handleDelete(image.id)}
              style={{ marginLeft: 10 }}
            >
              Delete
            </button>
          </div>
        ))}
        <button type="submit">Update Preview</button>

        {submitMessage && (
          <div>
            <p>{submitMessage}</p>
            <button
              onClick={() => {
                closeModal();
                window.location.reload();
              }}
            >
              Close
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateRecipeImages;
