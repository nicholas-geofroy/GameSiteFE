import { Component } from "react";
import { withRouter } from "react-router";
import { RouteComponentProps } from "react-router";
import "./lobby.css";

import { ws_url, createWsIdAuth, LobbySocket } from "../../backend/backend";
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
import GetGameTypeMsg from "../../models/get-game-type-msg";

enum LOBBY_STATE {
  SETUP = "setup",
  ATTEMPT_START = "attempt-start",
  IN_GAME = "in-game",
}

interface GameTypeMap {
  [index: string]: string;
}

var gameTypeTitle: GameTypeMap = {};
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

interface MatchParams {
  lobbyId: string;
}

interface GameState {
  players: Array<string>;
}

function isGameState(object: object): object is GameState {
  return "players" in object;
}

interface LobbyProps extends RouteComponentProps<MatchParams> {
  userId: string;
  userName: string;
}

interface LobbyState {
  lobbyState: LOBBY_STATE;
  users: Record<string, User>;
  gameState?: GameState;
  curGameType: GameType | "";
  lobbySocket?: LobbySocket;
  error?: any;
}

class ExistingLobby extends Component<LobbyProps> {
  userManager: UserManager;
  state: LobbyState;

  constructor(props: LobbyProps) {
    super(props);

    this.onStartClick = this.onStartClick.bind(this);
    this.updateUsers = this.updateUsers.bind(this);
    this.userManager = new UserManager(this.props.userId);
    this.state = {
      lobbyState: LOBBY_STATE.SETUP,
      users: {},
      gameState: undefined,
      curGameType: "",
      lobbySocket: undefined,
      error: "",
    };
  }

  componentDidMount() {
    const lobbyId = this.props.match.params.lobbyId;
    let url = ws_url + "/lobby/" + lobbyId + "/ws";
    console.log("Joining lobby", url, "with user id", this.props.userId);
    createWsIdAuth(url, this.props.userId)
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
          if (!isGameState(data)) {
            console.log("Received Non Game-State from websocket", data);
            return;
          }

          const state: GameState = data;
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

  updateUsers(newUsers: Array<string>) {
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
      if (gameState === undefined) {
        lobbySocket.send(new GetStateMsg()); // todo: this may cause a lot of calls, we should investigate
        return <Loading />;
      }
      if (curGameType == GameType.OH_HELL) {
        const onBet = (bet: number) => {
          const msg = new BetMsg(bet);
          console.log(`Betting ${bet} tricks`);
          console.log("message", msg);
          lobbySocket.send(msg);
        };
        const onPlay = (card: string) => {
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
            gameState={gameState as JustOneGame}
            lobbySocket={lobbySocket}
          />
        );
      } else {
        lobbySocket.send(new GetGameTypeMsg()); // todo: this may cause a lot of calls, we should investigate fixed number of retries
        return <Loading />;
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
