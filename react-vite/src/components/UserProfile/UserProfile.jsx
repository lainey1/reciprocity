import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import ManageRecipes from "../ManageRecipes/ManageRecipes";
import ManageCollections from "../Collections/ManageCollections";

import { thunkAuthenticate } from "../../redux/session";

import reciprocity_logo from "../../../public/reciprocity_logo.png";

import "./UserProfile.css";

function UserProfile() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.session.user);

  // Extract the 'section" query parameter to have active sections in the profile
  const queryParams = new URLSearchParams(location.search);
  const activeSection = queryParams.get("section") || "profile";

  useEffect(() => {
    if (!currentUser) {
      dispatch(thunkAuthenticate()); // Load current user data
    }
  }, [dispatch, currentUser]);

  if (!currentUser) {
    return (
      <img src={reciprocity_logo} alt="Loading..." className="logo-spinner" />
    );
  }

  return (
    <div id="profile-page">
      {/* Main Profile Details*/}
      <div id="main-profile">
        <div id="user-profile-pic">
          <img src={currentUser.profile_image_url} />
        </div>
        <div id="user-info">
          <h2 className="name">{currentUser.first_name}</h2>
          <span className="icon-username">
            <img src={reciprocity_logo} id="reciprocity-icon" />
            <h3>{currentUser.username}</h3>
          </span>
          <p>{currentUser.bio}</p>

          {/* user/:userId/edit */}
          <button
            id="edit-profile-button"
            onClick={() => navigate(`/user/${currentUser.id}/edit`)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <nav className="menu">
        <button
          className={activeSection === "collections" ? "active" : ""}
          onClick={() =>
            navigate(`/user/${currentUser.id}?section=collections`)
          }
        >
          Collections
        </button>

        <button
          className={activeSection === "created_recipes" ? "active" : ""}
          onClick={() =>
            navigate(`/user/${currentUser.id}?section=created_recipes`)
          }
        >
          Created
        </button>

        <button
          className={activeSection === "saved_recipes" ? "active" : ""}
          onClick={() =>
            navigate(`/user/${currentUser.id}?section=saved_recipes`)
          }
        >
          Saved
        </button>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === "created_recipes" && <ManageRecipes />}
      </div>

      <div className="main-content">
        {activeSection === "collections" && <ManageCollections />}
      </div>
    </div>
  );
}

export default UserProfile;
