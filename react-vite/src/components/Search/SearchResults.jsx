import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import no_image_available from "../../../public/no_image_available.png";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditRecipeCollection from "../Collections/EditRecipeCollection";

import "./SearchResults.css";

const SearchResults = () => {
  const results = useSelector((state) => state.search?.results); // Assume search results are stored in Redux state

  const { recipes = [], collections = [], users = [] } = results || {};

  return (
    <div id="search-results-page-container">
      <h2>Search Results</h2>
      <div className="all-recipes-grid">
        {/* Recipes */}
        {recipes.length > 0 && (
          <div>
            <h3>Recipes</h3>
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

        {/* Collections */}
        {collections.length > 0 && (
          <div>
            <h3>Collections</h3>
            {collections.map((collection) => (
              <div key={collection.id} className="image-tile">
                <Link
                  to={`/collections/${collection.id}`}
                  className="all-recipes-link"
                >
                  <div className="image-tile-container">
                    {collection.image ? (
                      <img
                        src={collection.image}
                        alt={`${collection.name} image`}
                      />
                    ) : (
                      <img src={no_image_available} alt="no image available" />
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

        {/* Users */}
        {users.length > 0 && (
          <div>
            <h3>Users</h3>
            {users.map((user) => (
              <div key={user.id} className="image-tile">
                <Link to={`/users/${user.id}`} className="all-recipes-link">
                  <div className="image-tile-container">
                    <img
                      src={user.profile_picture || no_image_available}
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
