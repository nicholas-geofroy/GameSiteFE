import { makeApiCall, http_url, default_opts } from "./backend";

export default class UserManager {
  constructor(auth0) {
    this.auth0 = auth0;
    this.users = {};
  }

  getDisplayName(userId) {
    if (userId in this.users) {
      return Promise.resolve(this.users[userId]);
    } else {
      console.log("makeApiCall cause user doesn't exist yet");
      return makeApiCall(
        http_url + "/user/" + encodeURIComponent(userId),
        default_opts,
        this.auth0
      ).then((data) => {
        console.log("received data!");
        this.users[userId] = data.displayName;
        return this.users[userId];
      });
    }
  }
}
