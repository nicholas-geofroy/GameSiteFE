import React from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { NavBar, Loading } from "./components";
import Profile from "./views/profile";
import Home from "./views/home";
import Lobby from "./views/lobby";
import ProtectedRoute from "./auth/protected-route";

function App() {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <div id="app" className="d-flex flex-column h-100">
      <NavBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <ProtectedRoute path="/profile" component={Profile} />
        <ProtectedRoute path="/lobby" component={Lobby} />
      </Switch>
    </div>
  );
}

export default App;
