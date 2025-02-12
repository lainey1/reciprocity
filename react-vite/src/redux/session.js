const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";
const UPDATE_USER = "session/updateUser";
// const DELETE_USER = "session/deleteUser";

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user,
});

// const deleteUser = (user) => ({
//   type: DELETE_USER,
//   payload: user,
// });

export const thunkAuthenticate = () => async (dispatch) => {
  const response = await fetch("/api/auth/");
  if (response.ok) {
    const data = await response.json();

    // If no user data is returned, return without logging an error
    if (!data || data.errors) {
      return;
    }

    dispatch(setUser(data));
  } else {
    // Optional: Handle the case when the response is not OK (e.g., status 4xx or 5xx)
    console.error("Failed to authenticate.");
  }
};

// export const thunkAuthenticate = () => async (dispatch) => {
// 	const response = await fetch("/api/auth/");
// 	if (response.ok) {
// 		const data = await response.json();
// 		if (data.errors) {
// 			return;
// 		}

// 		dispatch(setUser(data));
// 	}
// };

export const thunkLogin = (credentials) => async (dispatch) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages.errors;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

export const thunkSignup = (user) => async (dispatch) => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages.errors;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

export const thunkLogout = () => async (dispatch) => {
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

export const thunkUpdateProfile = (user_id, userData) => async (dispatch) => {
  console.log("USER ID====>", user_id);
  console.log("USER DATA====>", userData);
  const res = await fetch(`/api/users/${user_id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const updatedProfile = await res.json();
  dispatch(updateUser(updatedProfile));
  return updatedProfile;
};

// actions/userActions.js
export const thunkDeleteProfile = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users/${userId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const message = await response.json();
      dispatch({
        type: "DELETE_USER_SUCCESS",
        payload: message,
      });
    } else {
      const error = await response.json();
      dispatch({
        type: "DELETE_USER_FAILURE",
        payload: error.message || "Failed to delete user.",
      });
    }
  } catch (err) {
    dispatch({
      type: "DELETE_USER_FAILURE",
      payload: err.message || "An unexpected error occurred.",
    });
  }
};

const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };

    case UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };

    case "DELETE_USER_SUCCESS":
      return { ...state, successMessage: action.payload };

    case "DELETE_USER_FAILURE":
      return { ...state, errorMessage: action.payload };

    default:
      return state;
  }
}

export default sessionReducer;
