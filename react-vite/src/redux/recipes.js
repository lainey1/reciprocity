// action types
const SET_RECIPES = "recipes/setRecipes";
const SET_RECIPE = "recipes/setRecipe";
const ADD_RECIPE = "recipes/addRecipe";
const UPDATE_RECIPE = "recipes/updateRecipe";
const DELETE_RECIPE = "recipes/deleteRecipe";
const SET_LOADING = "recipes/setLoading";
const SET_ERRORS = "recipes/setError";

// action creators
const setRecipes = (recipes) => ({
  type: SET_RECIPES,
  payload: recipes,
});

const setRecipe = (recipe) => ({
  type: SET_RECIPE,
  payload: recipe,
});

const addRecipe = (recipe) => ({
  type: ADD_RECIPE,
  payload: recipe,
});

const deleteRecipe = (id) => ({
  type: DELETE_RECIPE,
  payload: id,
});

const updateRecipe = (recipe) => ({
  type: UPDATE_RECIPE,
  payload: recipe,
});

const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

const setErrors = (error) => ({
  type: SET_ERRORS,
  payload: error,
});

// Thunks
export const thunkFetchRecipes = () => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await fetch("/api/recipes");

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();
    dispatch(setRecipes(data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setErrors(error.message));
    dispatch(setLoading(false));
  }
};

export const thunkFetchRecipeById = (id) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await fetch(`/api/recipes/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch recipe");
    }

    const data = await response.json();
    dispatch(setRecipe(data.recipe));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setErrors(error.message));
    dispatch(setLoading(false));
  }
};

export const thunkCreateRecipe = (recipeData) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await fetch("/api/recipes/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(addRecipe(data)); // Dispatch addRecipe action
      return data.recipe;
    } else {
      const errors = await response.json();
      dispatch(setErrors(errors)); // dispatch errors addRecipe fails
    }
  } catch (err) {
    console.error("Error creating recipe:", err);
    dispatch(setErrors({ message: "Error submitting form" }));
  }
  dispatch(setLoading(false));
};

export const thunkUpdateRecipe =
  (recipe_id, recipeData) => async (dispatch) => {
    dispatch(setLoading(true));

    try {
      const response = await fetch(`/api/recipes/${recipe_id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(updateRecipe(data)); // Dispatch updateRecipe action

        return data;
      } else {
        const errors = await response.json();
        dispatch(setErrors(errors)); // Dispatch errors if creation failed
      }
    } catch (err) {
      console.error("Error creating recipe:", err);
      dispatch(setErrors({ message: "Error submitting form" }));
    }
    dispatch(setLoading(false));
  };

export const thunkDeleteRecipe = (id) => async (dispatch) => {
  dispatch(setLoading(true));

  try {
    const response = await fetch(`/api/recipes/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(deleteRecipe(id));
      dispatch(setLoading(false));
    } else {
      const errorData = await response.json();
      dispatch(setErrors(errorData)); // Dispatch errors if deletion failed
      dispatch(setLoading(false));
    }
  } catch (error) {
    console.error("Error deleting recipe:", error);
    dispatch(setErrors({ message: "Error deleting recipe" }));
    dispatch(setLoading(false));
  }
};

// initial state
const initialState = {
  recipes: {},
  recipe: null,
  loading: false,
  error: null,
};

// Utility function to normalize recipes
const normalizeRecipes = (recipes) => {
  return recipes.reduce((acc, recipe) => {
    acc[recipe.id] = recipe;
    return acc;
  }, {});
};

// reducer
function recipesReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_RECIPES:
      return {
        ...state,
        recipes: normalizeRecipes(payload),
        error: null,
      };

    case SET_RECIPE:
      return {
        ...state,
        recipes: { ...state.recipes, [payload.id]: payload },
        error: null,
      };

    case ADD_RECIPE:
      return {
        ...state,
        recipes: { ...state.recipes, [payload.id]: payload }, // Add or update the specific recipe
        error: null,
      };

    case UPDATE_RECIPE:
      return {
        ...state,
        recipes: {
          ...state.recipes,
          [payload.id]: { ...state.recipes[payload.id], ...payload }, // Update specific recipe
        },
        error: null,
      };

    case DELETE_RECIPE: {
      const newRecipes = { ...state.recipes };
      delete newRecipes[payload]; // Delete recipe by id
      return {
        ...state,
        recipes: newRecipes,
      };
    }

    case SET_LOADING:
      return { ...state, loading: payload };

    case SET_ERRORS:
      return { ...state, error: payload };

    default:
      return state;
  }
}

export default recipesReducer;
