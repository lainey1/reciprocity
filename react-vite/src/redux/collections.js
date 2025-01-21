// Action Types
const GET_COLLECTIONS = "collections/GET_COLLECTIONS";
const GET_COLLECTION_BY_ID = "collections/GET_COLLECTION_BY_ID";
const GET_COLLECTIONS_BY_OWNER = "collections/GET_COLLECTIONS_BY_OWNER";
const CREATE_COLLECTION = "collections/CREATE_COLLECTION";
const UPDATE_COLLECTION = "collections/UPDATE_COLLECTION";
const DELETE_COLLECTION = "collections/DELETE_COLLECTION";
const ADD_RECIPE_TO_COLLECTION = "collections/ADD_RECIPE_TO_COLLECTION";
const REMOVE_RECIPE_FROM_COLLECTION =
  "collections/REMOVE_RECIPE_FROM_COLLECTION";
const SET_ERRORS = "recipes/setError";

// Action Creators
const getCollections = (collections) => ({
  type: GET_COLLECTIONS,
  collections,
});

const getCollectionById = (collection) => ({
  type: GET_COLLECTION_BY_ID,
  collection,
});

const getCollectionsByOwner = (collections) => ({
  type: GET_COLLECTIONS_BY_OWNER,
  collections,
});

const createCollection = (collection) => ({
  type: CREATE_COLLECTION,
  collection,
});

const updateCollection = (collection) => ({
  type: UPDATE_COLLECTION,
  collection,
});

const deleteCollection = (collectionId) => ({
  type: DELETE_COLLECTION,
  collectionId,
});

const addRecipeToCollection = (collectionRecipe) => ({
  type: ADD_RECIPE_TO_COLLECTION,
  collectionRecipe,
});

const removeRecipeFromCollection = (recipeId, collectionId) => ({
  type: REMOVE_RECIPE_FROM_COLLECTION,
  recipeId,
  collectionId,
});

const setErrors = (error) => ({
  type: SET_ERRORS,
  payload: error,
});

// Thunks
export const fetchCollections = () => async (dispatch) => {
  const response = await fetch("/api/collections/");
  if (response.ok) {
    const data = await response.json();
    dispatch(getCollections(data.collections));
  }
};

export const fetchCollectionById = (id) => async (dispatch) => {
  const response = await fetch(`/api/collections/${id}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getCollectionById(data.collection));
  }
};

export const fetchCollectionsByOwner = (ownerId) => async (dispatch) => {
  const response = await fetch(`/api/collections/owner/${ownerId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(getCollectionsByOwner(data.collections_owned_by_user));
  }
};

export const createNewCollection = (collectionData) => async (dispatch) => {
  const response = await fetch("/api/collections/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(collectionData),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(createCollection(data.collection));
  }
};

export const editCollection = (id, collectionData) => async (dispatch) => {
  const response = await fetch(`/api/collections/${id}/edit`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(collectionData),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateCollection(data.collection));
  }
};

export const deleteCollectionById = (id) => async (dispatch) => {
  console.log("COLLECTION ID ===>", id);
  try {
    const response = await fetch(`/api/collections/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch(deleteCollection(id));
    } else {
      const errorData = await response.json();
      dispatch(setErrors(errorData)); // Dispatch errors if deletion failed
    }
  } catch (error) {
    console.error("Error deleting recipe:", error);
    dispatch(setErrors({ message: "Error deleting recipe" }));
  }
};

export const addRecipe = (collectionId, recipeId) => async (dispatch) => {
  const response = await fetch(`/api/collections/${collectionId}/add_recipe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipe_id: recipeId }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addRecipeToCollection(data.collection_recipe));
  }
};

export const removeRecipe = (collectionId, recipeId) => async (dispatch) => {
  const response = await fetch(
    `/api/collections/${collectionId}/remove_recipe`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipe_id: recipeId }),
    }
  );

  if (response.ok) {
    dispatch(removeRecipeFromCollection(recipeId, collectionId));
  }
};

// Reducer
const initialState = {
  allCollections: [],
  currentCollection: null,
  ownerCollections: [],
};

const collectionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLLECTIONS:
      return { ...state, allCollections: action.collections };
    case GET_COLLECTION_BY_ID:
      return { ...state, currentCollection: action.collection };
    case GET_COLLECTIONS_BY_OWNER:
      return { ...state, ownerCollections: action.collections };
    case CREATE_COLLECTION:
      return {
        ...state,
        allCollections: [...state.allCollections, action.collection],
      };
    case UPDATE_COLLECTION:
      return {
        ...state,
        allCollections: state.allCollections.map((collection) =>
          collection.id === action.collection.id
            ? action.collection
            : collection
        ),
      };
    case DELETE_COLLECTION:
      return {
        ...state,
        allCollections: state.allCollections.filter(
          (collection) => collection.id !== action.collectionId
        ),
      };
    case ADD_RECIPE_TO_COLLECTION:
      if (
        state.currentCollection?.id === action.collectionRecipe.collection_id
      ) {
        return {
          ...state,
          currentCollection: {
            ...state.currentCollection,
            recipes: [
              ...state.currentCollection.recipes,
              action.collectionRecipe,
            ],
          },
        };
      }
      return state;
    case REMOVE_RECIPE_FROM_COLLECTION:
      if (state.currentCollection?.id === action.collectionId) {
        return {
          ...state,
          currentCollection: {
            ...state.currentCollection,
            recipes: state.currentCollection.recipes.filter(
              (recipe) => recipe.id !== action.recipeId
            ),
          },
        };
      }
      return state;
    default:
      return state;
  }
};

export default collectionsReducer;
