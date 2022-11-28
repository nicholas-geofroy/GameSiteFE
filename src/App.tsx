import { Route, Switch } from "react-router-dom";
import { NavBar } from "./components";
import Home from "./views/home";
import Lobby from "./views/lobby";

function App() {
  return (
    <div id="app" className="d-flex flex-column h-100">
      <NavBar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/lobby" component={Lobby} />
      </Switch>
    </div>
  );
}

export default App;
