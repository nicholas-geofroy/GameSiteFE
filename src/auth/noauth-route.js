import React, { useState } from "react";
import { Route } from "react-router-dom";
import Loading from "../components/loading";

export const usernameRequired = (WrappedComponent) => {
  const GetUsername = ({ username, ...props }) => {
    const loading = false;
    const error = null;
    const data = {
      id: username,
    };

    if (loading) {
      return <Loading></Loading>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <WrappedComponent
        userName={username}
        userId={data["id"]}
        {...props}
      ></WrappedComponent>
    );
  };
  return GetDesiredUsername(GetUsername);
};

function GetDesiredUsername(WrappedComponent) {
  const GetUsernameComponent = (props) => {
    const [submit, setSubmit] = useState(false);
    const [username, setUsername] = useState("");

    const handleUsernameChange = (event) => {
      setUsername(event.target.value);
    };

    const onSubmit = (e) => {
      e.preventDefault();
      setSubmit(true);
      return false;
    };

    return (
      <>
        {submit || (
          <>
            <input
              className="playerInput input"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onSubmit={onSubmit}
              placeholder={"What's Your Name?"}
            />
            <button className="button primary" onClick={onSubmit}>
              Submit
            </button>
          </>
        )}
        {submit && <WrappedComponent username={username} {...props} />}
      </>
    );
  };
  return GetUsernameComponent;
}

const NoAuthRoute = ({ component, ...args }) => (
  <Route component={usernameRequired(component)} {...args} />
);

export default NoAuthRoute;
