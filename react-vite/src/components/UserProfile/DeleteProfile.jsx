import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { thunkDeleteProfile, thunkLogout } from "../../redux/session";
import { useNavigate } from "react-router-dom";

import { useModal } from "../../context/Modal";

const DeleteProfile = ({ user_id }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const currentUser = useSelector((state) => state.session.user);

  const formRef = useRef(null); // Reference to the form

  const handleDelete = (e) => {
    e.preventDefault();

    if (!currentUser) {
      console.log("User is not logged in or loading...");
      return; // Exit early if currentUser is not available
    }

    dispatch(thunkDeleteProfile(user_id))
      .then(() => {
        dispatch(thunkLogout());
        closeModal();
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to delete profile:", error);
      });
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    closeModal(); // Close modal if user cancels
  };

  // Close the modal when clicking outside the form
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  return (
    <div id="delete-user-form">
      <h1>Confirm Deletion of Your Profile</h1>
      <p>
        Are you sure you want to delete your profile? Deletion will remove your
        profile, reviews, reservation, and image data and is not reversible.{" "}
      </p>
      <button onClick={handleDelete} className="confirm-delete">
        Yes (Delete Profile)
      </button>
      <button onClick={cancelDelete} className="cancel-delete">
        No (Keep Profile)
      </button>
    </div>
  );
};

export default DeleteProfile;
