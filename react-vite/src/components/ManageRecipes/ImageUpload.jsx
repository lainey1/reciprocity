import { useState } from "react";

const ImageUpload = ({ recipeId, onImageUpload }) => {
  const [files, setFiles] = useState(null);
  const [uploadResults, setUploadResults] = useState([]); // Initialize as empty array
  const [selectedPreview, setSelectedPreview] = useState(null);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return alert("Please select files to upload!");

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));
    formData.append("recipe_id", recipeId); // Pass the recipe ID for association

    try {
      const response = await fetch(`/api/recipe_images/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadResults(data.urls);
        alert("Files uploaded successfully!");
        onImageUpload(data.urls); // Pass the image URLs back to parent
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while uploading.");
    }
  };

  const handlePreviewSelection = (url) => {
    setSelectedPreview(url);
  };

  return (
    <form>
      <input type="file" multiple onChange={handleFileChange} />
      <button type="button" onClick={handleUpload}>
        Upload
      </button>

      {uploadResults.length > 0 && (
        <div>
          <p>File uploaded successfully! Select a preview image:</p>
          {uploadResults.map((url, index) => (
            <div key={index}>
              <img src={url} alt={`Uploaded Image ${index}`} width="100" />
              <button onClick={() => handlePreviewSelection(url)}>
                Set as Preview Image
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedPreview && (
        <div>
          <p>Preview Image:</p>
          <img src={selectedPreview} alt="Selected Preview Image" width="150" />
        </div>
      )}
    </form>
  );
};

export default ImageUpload;
