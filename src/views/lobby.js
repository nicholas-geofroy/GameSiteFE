import React from "react"
import { Route, Switch, useRouteMatch } from "react-router-dom"
import ExistingLobby from "../components/lobby/existing-lobby"
import NewLobby from "../components/lobby/new-lobby"

const Lobby = () => {
  let match = useRouteMatch();
  return (<div>
    <Switch>
      <Route path={`${match.path}/:lobbyId`}>
        <ExistingLobby></ExistingLobby>
      </Route>
      <Route path={match.path}>
        <NewLobby></NewLobby>
      </Route>
    </Switch>
  </div>);
}

export default Lobby