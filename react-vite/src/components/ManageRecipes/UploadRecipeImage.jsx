import { useState } from "react";
import { useModal } from "../../context/Modal";

const UploadRecipeImage = ({ recipeId }) => {
  const [images, setImages] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const { closeModal } = useModal();

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
        setUploadResults(data.image_urls);
        setImageLoading(false);
      } else {
        console.error(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form encType="multipart/form-data">
      <h2>Add Recipe Image</h2>
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

      {uploadResults.length > 0 && (
        <div>
          <p>Upload successful!</p>
          {uploadResults.map((url, index) => (
            <div key={index}>
              <img
                src={url}
                alt={`Uploaded Image ${index}`}
                width="100"
                style={{ objectFit: "contain", height: "auto" }}
              />
            </div>
          ))}
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
  );
};

export default UploadRecipeImage;
