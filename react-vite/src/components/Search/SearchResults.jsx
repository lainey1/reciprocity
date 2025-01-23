import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import no_image_available from "../../../public/no_image_available.png";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditRecipeCollection from "../Collections/EditRecipeCollection";

import "./Search.css";

const SearchResults = () => {
  const results = useSelector((state) => state.search?.results); // Assume search results are stored in Redux state

  const { recipes = [], collections = [], users = [] } = results || {};

  return (
    <div id="search-results-page-container">
      <h3>Recipes</h3>
      <div className="search-grid">
        {/* Recipes */}
        {recipes.length > 0 && (
          <div className="search-section">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="image-tile">
                <Link to={`/recipes/${recipe.id}`} className="all-recipes-link">
                  <div className="image-tile-container">
                    {recipe.preview_image ? (
                      <img
                        src={recipe.preview_image}
                        alt={`${recipe.name} image`}
                      />
                    ) : (
                      <img src={no_image_available} alt="no image available" />
                    )}
                  </div>
                  <div className="recipe-highlight">
                    <p className="recipe-description">
                      <span style={{ fontWeight: "bold" }}>{recipe.name}</span>{" "}
                      {recipe.short_description}
                    </p>
                  </div>
                </Link>
                {/* Save button */}
                <div className="image-tile-action-buttons">
                  <OpenModalButton
                    buttonText="Save"
                    modalComponent={
                      <EditRecipeCollection recipeId={recipe.id} />
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <h3>Collections</h3>
      <div className="search-grid">
        {/* Collections */}
        {collections.length > 0 && (
          <div className="search-section">
            {collections.map((collection) => (
              <div key={collection.id} className="image-tile">
                <Link
                  to={`/collections/${collection.id}`}
                  className="all-recipes-link"
                >
                  <div className="image-tile-container">
                    {collection.collection_image.length > 0 ? (
                      <img
                        src={collection.collection_image[0]?.image_url} // Access the first image in the array
                        alt={collection.name}
                        className="collection-image"
                      />
                    ) : (
                      <img
                        src={no_image_available}
                        alt="no image available"
                        className="collection-image"
                      />
                    )}
                  </div>
                  <div className="recipe-highlight">
                    <p className="recipe-description">
                      <span style={{ fontWeight: "bold" }}>
                        {collection.name}
                      </span>
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <h3>Users</h3>
      <div className="search-grid">
        {/* Users */}
        {users.length > 0 && (
          <div className="search-section">
            {users.map((user) => (
              <div key={user.id} className="image-tile">
                <Link to={`/users/${user.id}`} className="all-recipes-link">
                  <div className="image-tile-container">
                    <img
                      src={user.profile_image_url || no_image_available}
                      alt={`${user.username} profile`}
                    />
                  </div>
                  <div className="recipe-highlight">
                    <p className="recipe-description">
                      <span style={{ fontWeight: "bold" }}>
                        {user.username}
                      </span>
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
