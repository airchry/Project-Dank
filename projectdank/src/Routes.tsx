import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import Home from "./components/Home";
import GamesHall from "./components/GamesHall";
import GameDetail from "./components/GameDetail";
import Crew from "./components/Crew";
import LoginPage from "./components/LoginPage";
import VaultWrapper from "./components/VaultWrapper";
import FeedWrapper from "./components/FeedWrapper";
import EditGame from "./components/EditGame";
import CreateGame from "./components/CreateGame";
import CreateCrew from "./components/CreateCrew"
import EditCrew from "./components/EditCrew";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home/>},
      { path: "games", element: <GamesHall/>},
      { path: "games/:gameId", element: <GameDetail/>},
      { path: "vault", element: <VaultWrapper/>},
      { path: "feed", element: <FeedWrapper/>},
      { path: "crew", element: <Crew/>},
      { path: "login", element: <LoginPage/>},
      { path: "games/create", element: <CreateGame /> },
      { path: "games/edit/:gameId", element: <EditGame /> },
      { path: "crew/create", element: <CreateCrew /> },
      { path: "crew/edit/:id", element: <EditCrew /> }

      // { path: "games", element: <Games /> },
    ],
  },
]);
