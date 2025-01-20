import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import no_image_available from "../../../public/no_image_available.png";

import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateCollection from "./CreateCollection";

import DeleteCollectionModal from "./DeleteCollectionModal";

import {
  fetchCollections,
  fetchCollectionsByOwner,
  // deleteCollectionById,
} from "../../../src/redux/collections";
import "./CollectionTiles.css";

const ManageCollections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector((state) => state.session.user.id);
  const userCollections = useSelector(
    (state) => state.collections.ownerCollections
  );

  useEffect(() => {
    dispatch(fetchCollections());
    dispatch(fetchCollectionsByOwner(userId));
  }, [dispatch, userId]);

  return (
    <div className="page-container">
      {/* Create New Collection */}
      <div id="manage-collection-buttons">
        <div id="manage-collection-buttons">
          <OpenModalButton
            buttonText="Create Collection"
            className="add-button"
            modalComponent={
              <CreateCollection
                collection_id={userCollections.id}
                collection_name={userCollections.name}
              />
            }
          />
        </div>
      </div>

      {/* List of Collections */}
      <div className="collections-grid">
        {userCollections?.map((collection) => (
          <div key={collection.id} className="collection-tile">
            <div className="image-tile">
              {/* Only make the image clickable */}
              <Link
                to={`/collections/${collection.id}`}
                className="collection-link"
              >
                <div className="collection-image-container">
                  {collection?.collection_image ? (
                    <img
                      src={collection.collection_image}
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
              </Link>

              {/* Action Buttons */}
              <div className="collection-action-buttons">
                <OpenModalButton
                  buttonText="Delete"
                  id="delete-button"
                  modalComponent={
                    <DeleteCollectionModal
                      collection_id={collection.id}
                      collection_name={collection.name}
                    />
                  }
                />
                <button
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the parent tile from triggering navigation
                    navigate(`/collections/${collection.id}/edit`);
                  }}
                >
                  <FaEdit /> Edit
                </button>
              </div>
            </div>
            <div>
              <p className="collection-tile-name">{collection.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCollections;
