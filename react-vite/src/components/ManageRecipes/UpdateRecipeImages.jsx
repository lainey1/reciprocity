import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkFetchRecipeById } from "../../redux/recipes";

const UpdateRecipeImages = ({ recipeId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunkFetchRecipeById(recipeId));
  }, [dispatch, recipeId]);

  const recipe_images = useSelector((state) => state.recipes?.recipe.images);

  const [images, setImages] = useState(recipe_images);
  const [imageLoading, setImageLoading] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(
    images.find((image) => image.is_preview)?.id || null
  );

  const handleCheckboxChange = (imageId) => {
    setSelectedPreview(imageId);
  };

  const handlePreviewCheckbox = async () => {
    try {
      await fetch(`/api/recipes/${recipeId}/update-preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previewImageId: selectedPreview }),
      });
      alert("Preview image updated successfully");
    } catch (error) {
      console.error("Error updating preview image", error);
    }
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (images.length === 0) return alert("Please select files to upload!");

    const formData = new FormData();
    images.forEach((file) => formData.append("file", file));

    formData.append("recipe_id", recipeId); // Pass the recipe ID for association
    setImageLoading(true);

    try {
      const response = await fetch(`/api/recipe_images/new`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        console.log("argh");
      } else {
        console.error(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form encType="multipart/form-data">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <button type="button" onClick={handleUpload}>
        Upload
      </button>
      {imageLoading && <p>Loading...</p>}

      <h3>Select a Preview Image</h3>
      <div
        onSubmit={(e) => {
          e.preventDefault();
          handlePreviewCheckbox();
        }}
      >
        {images?.map((image) => (
          <div
            key={image?.id}
            style={{ display: "flex", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={selectedPreview === image?.id}
              onChange={() => handleCheckboxChange(image?.id)}
            />
            <img
              src={image?.image_url}
              alt={image?.caption || "Recipe Image"}
              style={{ width: 100, marginLeft: 10 }}
            />
          </div>
        ))}
        <button type="submit">Update Preview</button>
      </div>
    </form>
  );
};

export default UpdateRecipeImages;
