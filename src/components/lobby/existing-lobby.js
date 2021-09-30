import React, { Component } from "react";
import { withRouter } from "react-router";
import { withAuth0 } from "@auth0/auth0-react";
import "./lobby.css";

import { ws_url, default_opts, createWs } from "../../backend/backend";
import UserManager from "../../backend/userManager";
import StartGameMsg from "../../models/startgame-msg";
import BetMsg from "../../models/bet-msg";
import Loading from "../loading";
import UserList from "./user-list";
import OhHell from "../game/ohHell";
import PlayMsg from "../../models/play-msg";
import JustOne from "../game/justOne";
import GetStateMsg from "../../models/get-state-msg";
import _ from "underscore";

const LOBBY_STATE = {
  SETUP: "setup",
  ATTEMPT_START: "attempt-start",
  IN_GAME: "in-game",
};

const gameType = {
  JUST_ONE: "JustOne",
  OH_HELL: "OhHell",
};

var gameTypeTitle = {};
gameTypeTitle[gameType.JUST_ONE] = "Just One";
gameTypeTitle[gameType.OH_HELL] = "Oh Hell";
gameTypeTitle[""] = "Loading...";

const messageType = {
  MEMBERS: "Members",
  GAME_TYPE: "GameType",
  START_GAME: "StartGame",
  ERROR: "Error",
  GAME_STATE: "GameState",
};

const errorType = {
  NOT_ENOUGH_PLAYERS: "NotEnoughPlayers",
};

class ExistingLobby extends Component {
  constructor(props) {
    super(props);

    this.onStartClick = this.onStartClick.bind(this);
    this.updateUserDisplayName = this.updateUserDisplayName.bind(this);
    this.updateUsers = this.updateUsers.bind(this);
    this.userManager = new UserManager(this.props.auth0);
    this.state = {
      lobbyState: LOBBY_STATE.SETUP,
      users: {},
      gameState: {},
      curGameType: "",
      lobbySocket: null,
      error: "",
    };
  }

  componentDidMount() {
    const lobbyId = this.props.match.params.lobbyId;

    createWs(
      ws_url + "/lobby/" + lobbyId + "/ws",
      default_opts,
      this.props.auth0
    )
      .then((lobbySocket) => {
        console.log("register callbacks");
        lobbySocket.register("members", messageType.MEMBERS, (data) => {
          this.updateUsers(data.users);
        });
        lobbySocket.register("start", messageType.START_GAME, (_) => {
          console.log("Start game message received");
          this.setState({
            lobbyState: LOBBY_STATE.IN_GAME,
          });
          lobbySocket.send(new GetStateMsg());
        });
        lobbySocket.register("error", messageType.ERROR, (data) => {
          console.log("Error", data);
        });
        lobbySocket.register("gameState", messageType.GAME_STATE, (data) => {
          const state = data.state;
          console.log("game state message received. state:", state);
          this.updateUsers(state.players);
          this.setState({
            gameState: state,
            lobbyState: LOBBY_STATE.IN_GAME,
          });
        });
        lobbySocket.register("gameType", messageType.GAME_TYPE, (data) => {
          console.log("New game type: " + data.gameType);
          this.setState({
            curGameType: data.gameType,
          });
        });
        this.setState({
          lobbySocket: lobbySocket,
        });
      })
      .catch((error) => this.setState({ error: error }));
  }

  componentWillUnmount() {
    if (this.state.lobbySocket) {
      this.state.lobbySocket.close();
    }
  }

  updateUsers(newUsers) {
    console.log("update users (new users:)", newUsers);
    var users = { ...this.state.users };
    newUsers.forEach((userId) => {
      if (!(userId in users)) {
        console.log(`new unkown user ${userId}. Fetching...`);
        users[userId] = {
          id: userId,
          loading: true,
          displayName: "",
        };
        this.updateUserDisplayName(userId);
      }
    });
    this.setState({
      users: users,
    });
  }

  updateUserDisplayName(userId) {
    this.userManager.getDisplayName(userId).then((displayName) => {
      this.setState((prevState) => ({
        users: {
          ...prevState.users,
          [userId]: {
            id: userId,
            displayName: displayName,
          },
        },
      }));
    });
  }

  onStartClick() {
    const lobbySocket = this.state.lobbySocket;
    if (lobbySocket) {
      console.log("Request Start Game");
      lobbySocket.send(new StartGameMsg());
    }
  }

  render() {
    const { user } = this.props.auth0;
    const userId = user.sub;
    const { lobbyState, users, gameState, curGameType, lobbySocket, error } =
      this.state;

    if (error) {
      return <div>{error.error}</div>;
    }
    if (!lobbySocket) {
      return <Loading />;
    }

    if (lobbyState === LOBBY_STATE.IN_GAME) {
      if (curGameType == gameType.OH_HELL) {
        const onBet = (bet) => {
          const msg = new BetMsg(bet);
          console.log(`Betting ${bet} tricks`);
          console.log("message", msg);
          lobbySocket.send(msg);
        };
        const onPlay = (card) => {
          const msg = new PlayMsg(card);
          console.log("Playing", card);
          lobbySocket.send(msg);
        };

        return (
          <OhHell
            myId={userId}
            gameState={gameState}
            onBet={onBet}
            onPlay={onPlay}
          />
        );
      } else if (curGameType == gameType.JUST_ONE) {
        return (
          <JustOne
            myId={userId}
            users={users}
            gameState={gameState}
            lobbySocket={lobbySocket}
          />
        );
      } else {
        return <div>Unknown Game Type</div>;
      }
    }

    const gameTitle = gameTypeTitle[curGameType];
    return (
      <div id="lobby">
        <h2>{gameTitle} Lobby</h2>
        <h4>Members</h4>
        <UserList users={users}></UserList>
        <button className="button primary" onClick={this.onStartClick}>
          Start Game
        </button>
      </div>
    );
  }
}

export default withAuth0(withRouter(ExistingLobby));
