import { createBrowserRouter } from "react-router-dom";
import About from "../components/About/About";
import {
  LoginFormModal,
  SignupFormModal,
} from "../components/AuthenticationForms";
import CreateCollection from "../components/Collections/CreateCollection";
import EditCollection from "../components/Collections/EditCollection";
import ViewCollection from "../components/Collections/ViewCollection.jsx";
import LandingPage from "../components/LandingPage";
import AllRecipes from "../components/ManageRecipes/AllRecipes.jsx";
import CreateRecipe from "../components/ManageRecipes/CreateRecipe";
import ManageRecipes from "../components/ManageRecipes/ManageRecipes";
import ReadRecipe from "../components/ManageRecipes/ReadRecipe";
import UpdateRecipe from "../components/ManageRecipes/UpdateRecipe";
import SearchResults from "../components/Search/SearchResults.jsx";
import EditProfile from "../components/UserProfile/EditProfile";
import UserProfile from "../components/UserProfile/UserProfile";
import Layout from "./Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <LoginFormModal />,
      },
      {
        path: "signup",
        element: <SignupFormModal />,
      },
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "recipes",
        element: <AllRecipes />,
      },
      {
        path: "recipes/owner/:owner_id",
        element: <ManageRecipes />,
      },
      {
        path: "/recipes/:id",
        element: <ReadRecipe />,
      },
      {
        path: "/recipes/new",
        element: <CreateRecipe />,
      },
      {
        path: "/recipes/:recipe_id/edit",
        element: <UpdateRecipe />,
      },
      {
        path: "/users/:userId",
        element: <UserProfile />,
      },
      {
        path: "/users/:user_id/edit",
        element: <EditProfile />,
      },
      {
        path: "/collections/new",
        element: <CreateCollection />,
      },
      {
        path: "/collections/:collection_id/edit",
        element: <EditCollection />,
      },
      {
        path: "/collections/:collection_id/",
        element: <ViewCollection />,
      },
      {
        path: "/search",
        element: <SearchResults />,
      },
    ],
  },
]);
