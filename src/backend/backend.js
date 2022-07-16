import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import _ from "underscore";
import LeaveMsg from "../models/leave-msg";

const backend_url = process.env.REACT_APP_SERVER_URL;
export const http_url =
  process.env.REACT_APP_IS_SECURE === "true"
    ? "https://" + backend_url
    : "http://" + backend_url;
export const ws_url =
  process.env.REACT_APP_IS_SECURE === "true"
    ? "wss://" + backend_url
    : "ws://" + backend_url;
export const default_opts = {
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  scope: "",
};

export const makeIdApiCall = (url, options = {}, userId) => {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      "X-Requested-With": "cardsite-fe",
      // Add the Authorization header to the existing headers
      "X-USER-ID": userId,
    },
  }).then((res) => res.json());
};

export const makeApiCall = (url, options = {}, auth0) => {
  const { getAccessTokenSilently } = auth0;

  const { audience, scope, ...fetchOptions } = options;
  return getAccessTokenSilently({ audience, scope })
    .then((accessToken) =>
      fetch(url, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
          "X-Requested-With": "cardsite-fe",
          // Add the Authorization header to the existing headers
          Authorization: `Bearer ${accessToken}`,
        },
      })
    )
    .then((res) => res.json());
};

export const useIdApi = (url, options = {}, userId) => {
  options["headers"] = options["headers"] || {};
  options["headers"]["X-USER-ID"] = userId;

  return useUnauthedApi(url, options);
};

export const useUnauthedApi = (url, options = {}) => {
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        console.log("try call");
        const res = await fetch(url, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
            "X-Requested-With": "cardsite-fe",
          },
        });
        setState({
          ...state,
          data: await res.json(),
          error: null,
          loading: false,
        });
      } catch (error) {
        setState({
          ...state,
          error,
          loading: false,
        });
      }
    })();
  }, [refreshIndex]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};

export const useApi = (url, options = {}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState({
    error: null,
    loading: true,
    data: null,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope, ...fetchOptions } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });
        const res = await fetch(url, {
          ...fetchOptions,
          headers: {
            "Content-Type": "application/json",
            ...fetchOptions.headers,
            "X-Requested-With": "cardsite-fe",
            // Add the Authorization header to the existing headers
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setState({
          ...state,
          data: await res.json(),
          error: null,
          loading: false,
        });
      } catch (error) {
        setState({
          ...state,
          error,
          loading: false,
        });
      }
    })();
  }, [refreshIndex]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};

const pingMsg = JSON.stringify({
  msgType: "Ping",
  data: {},
});

export const useCreateWs = (url, options = {}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [state, setState] = useState({
    error: null,
    loading: true,
    websocket: null,
  });
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { audience, scope } = options;
        const accessToken = await getAccessTokenSilently({ audience, scope });
        console.log("create webscket for url " + url);
        var websocket = new WebSocket(url);
        const ping = () => {
          websocket.send(pingMsg);
        };
        var pingInterval = null;
        var authMsg = {
          msgType: "Join",
          data: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        websocket.onopen = function (event) {
          console.log("websocket onopen");
          websocket.send(JSON.stringify(authMsg));
          pingInterval = window.setInterval(ping, 5000); //ping the server every 5s so connection isnt closed
        };
        websocket.onerror = function (event) {
          console.log("on error");
          console.log("Error: ", event);
        };
        websocket.onmessage = function (event) {
          console.log("received message", event);
        };
        websocket.onclose = function (event) {
          console.log("socket closed", event);
          if (pingInterval) {
            window.clearInterval(pingInterval);
          }
        };
        setState({
          ...state,
          error: null,
          loading: false,
          websocket: websocket,
        });
      } catch (error) {
        setState({
          ...state,
          error,
          loading: false,
        });
      }
    })();
  }, [refreshIndex]);

  return {
    ...state,
    refresh: () => setRefreshIndex(refreshIndex + 1),
  };
};

export class LobbySocket {
  constructor(ws) {
    this.handleMessage = this.handleMessage.bind(this);

    this.ws = ws;
    this.handlers = {};

    ws.onmessage = this.handleMessage;
  }

  handleMessage(event) {
    console.log("received message");
    let message = JSON.parse(event.data);
    let type = message.msgType;
    console.log("type:", type);
    console.log("data:", message.data);

    if (this.handlers.hasOwnProperty(type)) {
      const handlerList = this.handlers[type];
      handlerList.forEach(({ id, fun }) => {
        fun(message.data);
      });
    } else {
      console.log("Message of type " + type + "not handled");
    }
  }

  register(handleId, type, handle) {
    const handleObj = { id: handleId, fun: handle };
    const handleList = this.handlers[type] || [];
    handleList.push(handleObj);
    this.handlers[type] = handleList;
  }

  send(message) {
    console.log("send message: ", message);
    this.ws.send(message.toString());
  }

  remove(handleId, type) {
    this.handlers[type] = this.handlers[type].filter((h) => h.id !== handleId);
  }

  close() {
    console.log("close lobby socket");
    this.send(new LeaveMsg());
    this.ws.close();
  }
}

export const createWsIdAuth = (url, options = {}, userId) => {
  var websocket = new WebSocket(url);
  const ping = () => {
    websocket.send(pingMsg);
  };
  var pingInterval = null;
  var authMsg = {
    msgType: "Join",
    data: {
      UserId: String(userId),
    },
  };

  websocket.onopen = function (event) {
    console.log("websocket onopen");
    websocket.send(JSON.stringify(authMsg));
    pingInterval = window.setInterval(ping, 5000); //ping the server every 5s so connection isnt closed
  };
  websocket.onerror = function (event) {
    console.log("on error");
    console.log("Error: ", event);
  };

  websocket.onclose = function (event) {
    console.log("socket closed", event);
    if (pingInterval) {
      window.clearInterval(pingInterval);
    }
  };
  return Promise.resolve(new LobbySocket(websocket));
};

export const createWs = (url, options = {}, auth0) => {
  const { getAccessTokenSilently } = auth0;

  const { audience, scope, ...fetchOptions } = options;
  return getAccessTokenSilently({ audience, scope }).then((accessToken) => {
    console.log("accessToken Received, creating websocket");
    var websocket = new WebSocket(url);
    const ping = () => {
      websocket.send(pingMsg);
    };
    var pingInterval = null;
    var authMsg = {
      msgType: "Join",
      data: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    websocket.onopen = function (event) {
      console.log("websocket onopen");
      websocket.send(JSON.stringify(authMsg));
      pingInterval = window.setInterval(ping, 5000); //ping the server every 5s so connection isnt closed
    };
    websocket.onerror = function (event) {
      console.log("on error");
      console.log("Error: ", event);
    };

    websocket.onclose = function (event) {
      console.log("socket closed", event);
      if (pingInterval) {
        window.clearInterval(pingInterval);
      }
    };
    return new LobbySocket(websocket);
  });
};
