import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkLogout } from "../../redux/session";

import OpenModalMenuItem from "./OpenModalMenuItem";
import { LoginFormModal, SignupFormModal } from "../AuthenticationForms";

import icon from "../../../public/reciprocity_logo.png";

function MobileProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.session?.user);
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  // Toggle the dropdown menu
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
    <div className="mobile-profile-container">
      <button onClick={toggleMenu} id="mobile-profile-button">
        <img
          src={user?.profile_image_url || icon}
          alt={`${user?.first_name}'s profile`}
          className="profile-image"
        />
      </button>
      <div className="drop-down-container">
        {showMenu && (
          <ul className={"profile-menu-dropdown"} ref={ulRef}>
            {user ? (
              <>
                <li
                  onClick={() =>
                    navigate("/user/:user_id?section=created_recipes")
                  }
                >
                  Edit Profile
                </li>
                <li onClick={() => navigate("/recipes")}>All Recipes</li>
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
                <hr className="menu-separator" /> {/* Horizontal line */}
                <li onClick={() => navigate("/recipes")}>All Recipes</li>
              </>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MobileProfileButton;
