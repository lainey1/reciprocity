import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../AuthenticationForms/LoginFormModal";
import SignupFormModal from "../AuthenticationForms/SignupFormModal";
import logo from "../../../public/reciprocity_logo.png";

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.session.user);
  const [showMenu, setShowMenu] = useState(false);

  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(thunkLogout());
    navigate("/");
    closeMenu();
  };

  return (
    <>
      <div className="profile-button-container">
        <button
          onClick={() => navigate("/user/:user_id?section=created_recipes")}
          id="profile-dropdown-button"
        >
          <img
            src={user.profile_image_url || logo}
            alt={`${user.first_name}'s profile`}
            className="profile-image"
            onClick={() => navigate("/user/:user_id?section=created_recipes")}
          />
        </button>
        <button onClick={toggleMenu} id="profile-dropdown-button">
          ☰
        </button>
      </div>
      <div className="drop-down-container">
        {showMenu && (
          <ul className={"profile-menu-dropdown"} ref={ulRef}>
            {user ? (
              <>
                <li
                  className="profile-details no-click"
                  onClick={() =>
                    navigate("/user/:user_id?section=created_recipes")
                  }
                >
                  <img
                    src={user.profile_image_url || logo}
                    alt={`${user.first_name}'s profile`}
                    className="profile-image"
                  />
                  <div id="profile-details-text">
                    <p style={{ fontWeight: "bold" }}>{user.first_name}</p>
                    <p>{user.username}</p>
                    <p>{user.email}</p>
                  </div>
                </li>
                <hr className="menu-separator" /> {/* Horizontal line */}
                <li
                  onClick={() =>
                    navigate("/user/:user_id?section=created_recipes")
                  }
                >
                  Edit Profile
                </li>
                <li onClick={logout}>Logout</li>
              </>
            ) : (
              <>
                <OpenModalMenuItem
                  itemText="Log In"
                  onItemClick={closeMenu}
                  modalComponent={<LoginFormModal />}
                />
                <OpenModalMenuItem
                  itemText="Sign Up"
                  onItemClick={closeMenu}
                  modalComponent={<SignupFormModal />}
                />
              </>
            )}
          </ul>
        )}
      </div>
    </>
  );
}

export default ProfileButton;
