// redux/users.js

export const thunkFetchUserProfile = (userId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/users/${userId}`); // Adjust the API endpoint
    if (response.ok) {
      const data = await response.json();
      dispatch({
        type: "users/setUserProfile",
        payload: { userId, profile: data },
      });
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
};

// Initial state for users
const initialState = {};

// Users reducer
export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case "users/setUserProfile":
      return {
        ...state,
        [action.payload.userId]: action.payload.profile,
      };
    default:
      return state;
  }
}
