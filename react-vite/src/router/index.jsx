import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import LandingPage from "../components/LandingPage";
import About from "../components/About/About";
import {
  LoginFormModal,
  SignupFormModal,
} from "../components/AuthenticationForms";
import AllRecipes from "../components/ManageRecipes/AllRecipes";
import ReadRecipe from "../components/ManageRecipes/ReadRecipe";
import ManageRecipes from "../components/ManageRecipes/ManageRecipes";
import CreateRecipe from "../components/ManageRecipes/CreateRecipe";
import UpdateRecipe from "../components/ManageRecipes/UpdateRecipe";
import UserProfile from "../components/UserProfile/UserProfile";
import EditProfile from "../components/UserProfile/EditProfile";

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
        path: "/user/:userId",
        element: <UserProfile />,
      },
      {
        path: "/user/:user_id/edit",
        element: <EditProfile />,
      },
      // {
      //   path: "user/:userId/delete",
      //   element: <DeleteProfile />,
      // },
    ],
  },
]);
