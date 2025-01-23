//action type

const GET_RESULTS = "search/getResults";
const SET_LOADING = "recipes/setLoading";
const SET_ERRORS = "recipes/setError";

// action creators
const fetchResults = (results) => ({
  type: GET_RESULTS,
  payload: results,
});

const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

const setErrors = (error) => ({
  type: SET_ERRORS,
  payload: error,
});

// Thunk
export const thunkFetchSearchResults = (query) => async (dispatch) => {
  console.log("QUERY ===>", query);
  dispatch(setLoading(true));

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    console.log("RESPONSE ===>", response);

    if (!response.ok) {
      const errorData = await response.json();
      dispatch(setErrors(errorData));
      return errorData;
    }

    const data = await response.json();
    console.log("FETCHED DATA ===>", data);
    dispatch(fetchResults(data));
    dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("An error occurred while searching", error);
    dispatch(setErrors({ message: "Failed to fetch search results" }));
  }

  dispatch(setLoading(false));
};

const initialState = {
  results: {
    recipes: [],
    collections: [],
    users: [],
  },
  error: null,
  loading: false,
};

// reducer
function searchReducer(state = initialState, { type, payload }) {
  switch (type) {
    case GET_RESULTS:
      return {
        ...state,
        results: payload,
        error: null,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: payload,
      };
    case SET_ERRORS:
      return {
        ...state,
        error: payload,
      };
    default:
      return state;
  }
}

export default searchReducer;
