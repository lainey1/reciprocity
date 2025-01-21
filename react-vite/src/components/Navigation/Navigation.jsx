import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import reciprocity_banner from "../../../public/reciprocity_banner.png";
import MobileProfileButton from "./MobileProfileButton";
import ProfileButton from "./ProfileButton";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { LoginFormModal, SignupFormModal } from "../AuthenticationForms";

import "./Navigation.css";

function Navigation() {
  const user = useSelector((store) => store.session.user);

  return (
    <nav id="nav-bar">
      {/* Logo Section */}
      <Link to="/" className="logo-link">
        <img src={reciprocity_banner} alt="Reciprocity Logo" id="logo-banner" />
      </Link>

      {/*Hamburger Icon for mobile */}
      <MobileProfileButton />

      {/* Search Bar */}
      {/* <div id="search-bar-container">
        <SearchBar />
      </div> */}

      {/* Navigation Links */}
      <div id="nav-links">
        <Link to="/recipes" className="nav-link">
          All Recipes
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        {!user ? (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              id="login-button"
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              id="signup-button"
              modalComponent={<SignupFormModal />}
            />
          </>
        ) : (
          <ProfileButton />
        )}
      </div>
    </nav>
  );
}

export default Navigation;
