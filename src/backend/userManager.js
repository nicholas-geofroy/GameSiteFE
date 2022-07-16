import { http_url, default_opts, makeIdApiCall } from "./backend";

export default class UserManager {
  constructor(userId) {
    this.userId = userId;
    this.users = {};
  }

  getDisplayName(userId) {
    if (userId in this.users) {
      return Promise.resolve(this.users[userId]);
    } else {
      console.log("makeApiCall cause user doesn't exist yet");
      return makeIdApiCall(
        http_url + "/user/" + encodeURIComponent(userId),
        default_opts,
        this.userId
      ).then((data) => {
        console.log("received data!");
        this.users[userId] = data.displayName;
        return this.users[userId];
      });
    }
  }
}
