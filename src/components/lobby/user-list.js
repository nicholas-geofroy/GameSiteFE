import React from "react";

const UserList = (props) => {
  const users = Object.values(props.users).map((u) => (
    <User key={u.id} userId={u.id} displayName={u.displayName}></User>
  ));
  return <ul>{users}</ul>;
};

const User = (props) => {
  const userId = props.userId;
  const displayName = props.displayName;

  if (!displayName) {
    return <div key={userId}>Connecting...</div>;
  } else {
    return <li key={userId}>{displayName}</li>;
  }
};

export default UserList;
