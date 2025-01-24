import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import reciprocity_banner from "../../../public/reciprocity_banner.png";
import { LoginFormModal, SignupFormModal } from "../AuthenticationForms";
import MobileProfileButton from "./MobileProfileButton";
import OpenModalMenuItem from "./OpenModalMenuItem";
import ProfileButton from "./ProfileButton";
import SearchBar from "../Search/SearchBar";

import "./Navigation.css";

function Navigation() {
  const user = useSelector((store) => store.session.user);

  return (
    <nav id="nav-bar">
      <div id="mobile-top-banner">
        {/* Logo Section */}
        <Link to="/" className="logo-link">
          <img
            src={reciprocity_banner}
            alt="Reciprocity Logo"
            id="logo-banner"
          />
        </Link>
      </div>

      {/*Search Bar */}
      <div id="search-bar-container">
        <SearchBar />
        {/*Hamburger Icon for mobile */}
        <MobileProfileButton />
      </div>

      {/* Navigation Links */}
      <div id="nav-links">
        <Link to="/recipes" className="nav-link">
          Explore
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
