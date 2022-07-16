import React from "react";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import Loading from "../loading";
import "./lobby.css";

import { http_url, default_opts, useUnauthedApi } from "../../backend/backend";

const useCreateLobby = (id) => {
  console.log("useCreateLobby: ", id);
  const opts = {
    ...default_opts,
    method: "POST",
    body: "{}",
  };
  return useUnauthedApi(http_url + "/lobby/" + id, opts);
};

const NewLobbyRequest = (params) => {
  const { loading, error, data } = useCreateLobby(params.lobbyId);

  if (loading) {
    return (
      <>
        <div className="secondaryText">Creating Lobby ... </div>
        <Loading></Loading>
      </>
    );
  }
  if (error) {
    return <div>{error.error}</div>;
  }

  console.log(`created lobby with id ${data.id}`);
  return <Redirect to={`/lobby/${data.id}`} />;
};

const toValidLobbyId = (id) => {
  return id.replaceAll(/[\W]/g, "_");
};

const NewLobby = () => {
  const [lobbyId, setLobbyId] = useState("");
  const [submit, setSubmit] = useState(false);
  const onSubmit = (event) => {
    setSubmit(true);
    event.preventDefault();
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit(event);
      return false;
    }
  };

  if (submit) {
    return <NewLobbyRequest lobbyId={toValidLobbyId(lobbyId)} />;
  }

  return (
    <form>
      <h3 className="title">Create/Join a Lobby</h3>
      <input
        type="text"
        id="lobbyNameInput"
        className="surface input"
        placeholder="Lobby Name"
        value={lobbyId}
        onChange={(e) => setLobbyId(e.target.value)}
        onKeyDown={onKeyDown}
      ></input>
      <button className="button primary" onClick={onSubmit} type="button">
        Submit
      </button>
    </form>
  );
};

export default NewLobby;
