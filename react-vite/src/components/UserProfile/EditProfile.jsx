import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteProfile from "./DeleteProfile.jsx";
import { useModal } from "../../context/Modal.jsx";

import { thunkUpdateProfile } from "../../redux/session";

import "./EditProfile.css";

function EditProfile() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const currentUser = useSelector((state) => state.session.user);

  const [formData, setFormData] = useState({
    first_name: "",
    profile_image_url: "",
    bio: "",
    location: "",
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);

  // Synchronize formData with currentUser
  useEffect(() => {
    if (currentUser) {
      setFormData({
        first_name: currentUser.first_name || "",
        profile_image_url: currentUser.profile_image_url || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const updatedProfile = {
      first_name: formData.first_name,
      profile_image_url: formData.profile_image_url,
      bio: formData.bio,
      location: formData.location,
    };

    const res = await dispatch(
      thunkUpdateProfile(currentUser.id, updatedProfile)
    );

    if (res.errors) {
      setErrors(res.errors);
    } else {
      closeModal(); // Directly call closeModal() here
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Update Your Profile</h2>
      {errors.map((error, idx) => (
        <div key={idx} className="error-message">
          {error}
        </div>
      ))}

      <form className="update-profile-form" onSubmit={handleSubmit}>
        <label htmlFor="first_name">First Name </label>
        <input
          id="first_name"
          placeholder="First Name"
          type="text"
          value={formData.first_name}
          onChange={handleChange}
        />
        {hasSubmitted && !formData.first_name && (
          <div className="error-message">First Name is required.</div>
        )}

        <label htmlFor="profile_image_url">Profile Image</label>
        <input
          id="profile_image_url"
          placeholder="Profile Image URL"
          type="text"
          value={formData.profile_image_url}
          onChange={handleChange}
        />
        {hasSubmitted && !formData.profile_image_url && (
          <div className="error-message">Profile image URL is required.</div>
        )}

        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          placeholder="Tell your story"
          value={formData.bio}
          onChange={handleChange}
        />
        {hasSubmitted && !formData.bio && (
          <div className="error-message">Bio is required.</div>
        )}

        <label htmlFor="location">Location</label>
        <input
          id="location"
          placeholder="City, State"
          type="text"
          value={formData.location}
          onChange={handleChange}
        />
        {hasSubmitted && !formData.location && (
          <div className="error-message">Location is required.</div>
        )}

        <div className="edit-profile-buttons">
          {/* Open Delete Modal Button */}
          <OpenModalButton
            buttonText="Delete"
            id="delete-profile-button"
            modalComponent={<DeleteProfile user_id={currentUser.id} />}
          />

          <button id="save-profile-button" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;
