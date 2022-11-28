import { Route, Switch, useRouteMatch } from "react-router-dom";
import ExistingLobby from "../components/lobby/existing-lobby";
import NewLobby from "../components/lobby/new-lobby";

interface LobbyProps {}

const Lobby = (props: LobbyProps) => {
  let match = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route path={`${match.path}/:lobbyId`}>
          <ExistingLobby {...props}></ExistingLobby>
        </Route>
        <Route path={match.path}>
          <NewLobby {...props}></NewLobby>
        </Route>
      </Switch>
    </div>
  );
};

export default Lobby;
