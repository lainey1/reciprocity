import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useModal } from "../../context/Modal";

import "./AuthForms.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        // email,
        email_or_username: emailOrUsername,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  // Demo User credentials
  const demoUser = {
    email_or_username: "little_chef",
    password: "password",
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();

    // Dispatching the login action for demo user
    dispatch(thunkLogin(demoUser))
      .then(() => {
        closeModal(); // Close modal after successful login
        navigate("/recipes"); // Navigate to the user page after login
      })
      .catch((error) => {
        console.error("Login failed", error); // Handle error if login fails
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Log In</h2>
        <label>
          {/* Email */}
          Email or Username
          <input
            type="text"
            // value={email}
            value={emailOrUsername}
            // onChange={(e) => setEmail(e.target.value)}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <button type="submit" className="modal-form">
          Log In
        </button>
        <br />

        {/* Demo User Login Link */}
        <Link
          to="#"
          onClick={handleDemoLogin}
          style={{ textDecoration: "none" }}
        >
          Log in as Demo User
        </Link>
      </form>
    </div>
  );
}

export default LoginFormModal;
