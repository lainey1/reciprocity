// frontend/src/components/FileUpload.jsx
import { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file to upload!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadResult(data.url);
        alert("File uploaded successfully!");
      } else {
        alert(data.error || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while uploading.");
    }
  };

  return (
    <div>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {uploadResult && (
        <div>
          <p>File uploaded successfully! Here’s your file URL:</p>
          <a href={uploadResult} target="_blank" rel="noreferrer">
            {uploadResult}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
