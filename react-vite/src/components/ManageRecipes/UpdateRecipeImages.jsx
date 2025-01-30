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

  const handleSubmit = async () => {
    setSubmitMessage(""); // Reset the message before submitting

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

      // Set success message
      setSubmitMessage("Preview image updated successfully!");
    } catch (error) {
      console.error("Error updating preview image", error);
      // Set error message
      setSubmitMessage("An error occurred while updating the preview image.");
    }
  };

  return (
    <div>
      <h3>Select a Preview Image</h3>
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
          </div>
        ))}
        <button type="submit">Update Preview</button>
        {/* Conditionally render the message */}
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
