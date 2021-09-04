import React from 'react';
import { Redirect } from "react-router-dom"

import { backend_url, default_opts, useApi } from "../../backend"

const useCreateLobby = () => {
  const opts = { ...default_opts,
    method: "POST",
    body: "{}"
  }
  return useApi(
    "http://" + backend_url + "/lobby",
    opts
  )
};

const NewLobby = () => {
  const { loading, error, data } = useCreateLobby()

  if (loading) {
    return <div>Creating Lobby ... </div>
  }
  if (error) {
    return <div>{error.error}</div>
  }

  console.log(`created lobby with id ${data.id}`)
  return (
    <Redirect to={`/lobby/${data.id}`} />
  );
};

export default NewLobby