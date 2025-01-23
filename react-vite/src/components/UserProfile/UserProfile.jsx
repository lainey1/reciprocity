import { useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import ManageCollections from "../Collections/ManageCollections";
import ManageRecipes from "../ManageRecipes/ManageRecipes";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditProfile from "./EditProfile";

import { thunkAuthenticate } from "../../redux/session";
import { thunkFetchUserProfile } from "../../redux/users";

import reciprocity_logo from "../../../public/reciprocity_logo.png";

import "./UserProfile.css";

function UserProfile() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  const currentUser = useSelector((state) => state.session?.user);
  const selectedProfile = useSelector((state) => state.users?.[userId]?.user); // Fetch the profile from Redux store

  // Extract the 'section' query parameter to determine active sections in the profile
  const queryParams = new URLSearchParams(location.search);
  const activeSection = queryParams.get("section") || "profile";

  useEffect(() => {
    if (!currentUser) {
      dispatch(thunkAuthenticate()); // Load current user data
    }

    if (!selectedProfile && userId) {
      dispatch(thunkFetchUserProfile(userId)); // Fetch the selected user's profile
    }
  }, [dispatch, currentUser, selectedProfile, userId]);

  // Handle loading state
  if (!currentUser) {
    return (
      <img src={reciprocity_logo} alt="Loading..." className="logo-spinner" />
    );
  }

  // Determine if the profile being viewed is the current user's or someone else's
  const isCurrentUser = parseInt(userId) === currentUser.id;
  const profile = isCurrentUser ? currentUser : selectedProfile;

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div id="profile-page">
      {/* Main Profile Details */}
      <div id="main-profile">
        <div id="user-profile-pic">
          <img
            src={profile.profile_image_url || reciprocity_logo}
            alt={`${profile.first_name}'s profile`}
          />
        </div>
        <div id="user-info">
          <h2 className="name">{profile.first_name}</h2>
          <span className="icon-username">
            <img src={reciprocity_logo} id="reciprocity-icon" />
            <h3>{profile.username}</h3>
          </span>
          <p>{profile.bio}</p>

          {isCurrentUser && (
            <OpenModalButton
              buttonText={
                <span>
                  <FaEdit /> Edit Profile
                </span>
              }
              id="edit-profile-button"
              modalComponent={<EditProfile user_id={currentUser.id} />}
            />
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="menu">
        <button
          className={activeSection === "collections" ? "active" : ""}
          onClick={() => navigate(`/users/${profile.id}?section=collections`)}
        >
          Collections
        </button>

        <button
          className={activeSection === "created_recipes" ? "active" : ""}
          onClick={() =>
            navigate(`/users/${profile.id}?section=created_recipes`)
          }
        >
          Created
        </button>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === "created_recipes" && <ManageRecipes />}
        {activeSection === "collections" && <ManageCollections />}
      </div>
    </div>
  );
}

export default UserProfile;
