import React, { Component } from "react";
import { withRouter } from "react-router";
import { withAuth0 } from "@auth0/auth0-react";
import "./lobby.css";

import {
  ws_url,
  default_opts,
  createWs,
  createWsIdAuth,
} from "../../backend/backend";
import UserManager from "../../backend/userManager";
import StartGameMsg from "../../models/startgame-msg";
import BetMsg from "../../models/bet-msg";
import Loading from "../loading";
import UserList from "./user-list";
import OhHell from "../game/ohHell";
import PlayMsg from "../../models/play-msg";
import JustOne from "../game/justOne";
import GetStateMsg from "../../models/get-state-msg";
import GameType from "../game/types";
import _ from "underscore";
import SettingsList from "./settings-list";
import { usernameRequired } from "../../auth/noauth-route";

const LOBBY_STATE = {
  SETUP: "setup",
  ATTEMPT_START: "attempt-start",
  IN_GAME: "in-game",
};

var gameTypeTitle = {};
gameTypeTitle[GameType.JUST_ONE] = "Just One";
gameTypeTitle[GameType.OH_HELL] = "Oh Hell";
gameTypeTitle[""] = "Loading...";

const messageType = {
  MEMBERS: "members",
  GAME_TYPE: "selectedGame",
  START_GAME: "startGame",
  ERROR: "error",
  GAME_STATE: "gameState",
};

const errorType = {
  NOT_ENOUGH_PLAYERS: "NotEnoughPlayers",
};

class ExistingLobby extends Component {
  constructor(props) {
    super(props);

    this.onStartClick = this.onStartClick.bind(this);
    this.updateUsers = this.updateUsers.bind(this);
    this.userManager = new UserManager(this.props.userId);
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
    let url = ws_url + "/lobby/" + lobbyId + "/ws";
    console.log("Joining lobby", url, "with user id", this.props.userId);
    createWsIdAuth(url, default_opts, this.props.userId)
      .then((lobbySocket) => {
        console.log("register callbacks");
        lobbySocket.register("members", messageType.MEMBERS, (data) => {
          this.updateUsers(data);
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
        lobbySocket.register("selectedGame", messageType.GAME_TYPE, (data) => {
          console.log("New game type: " + data);
          this.setState({
            curGameType: data,
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
          loading: false,
          displayName: userId,
        };
      }
    });
    this.setState({
      users: users,
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
    const userId = this.props.userId;
    const { lobbyState, users, gameState, curGameType, lobbySocket, error } =
      this.state;
    console.log("users", users);

    if (error) {
      return <div>{error.error}</div>;
    }
    if (!lobbySocket) {
      return <Loading />;
    }

    if (lobbyState === LOBBY_STATE.IN_GAME) {
      if (curGameType == GameType.OH_HELL) {
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
      } else if (curGameType == GameType.JUST_ONE) {
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
        <div id="titleSection">
          <h2 className="primaryText">{gameTitle} Lobby</h2>
          <button className="button primary" onClick={this.onStartClick}>
            Start Game
          </button>
        </div>
        <div id="membersSection" className="surface section">
          <h4 className="secondaryText">Members</h4>
          <UserList users={users}></UserList>
        </div>
        <div id="membersSection" className="surface section">
          <h4 className="secondaryText">Settings</h4>
          <SettingsList gameType={curGameType} />
        </div>
      </div>
    );
  }
}

export default usernameRequired(withRouter(ExistingLobby));
