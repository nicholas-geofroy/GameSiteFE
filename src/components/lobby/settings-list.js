import React from "react";
import GameType from "../game/types";
import Setting from "./setting";
import { http_url, default_opts, useApi } from "../../backend/backend";
import Loading from "../loading";

const useGetSettingsList = (gameType) => {
  console.log("useGetSettingsList: ", gameType);
  const opts = { ...default_opts };
  return useApi(http_url + "/games/" + gameType + "/settings");
};

const useDummyGetSettingsList = (gameType) => {
  return { loading: false, data: dummySettingsList };
};

const dummySettingsList = {
  settings: [
    {
      name: "rounds",
      description: "Number of times each player has to be the guesser",
      type: "number",
      defaultVal: "5",
      values: [
        {
          range: {
            min: 0,
            max: 100,
          },
        },
      ],
    },
    {
      name: "word list",
      description: "List of words to play with",
      type: "enum",
      defaultVal: "concreteNouns",
      values: [
        {
          name: "concreteNouns",
          displayName: "Concrete Nouns",
          description: "A noun that you can see, hear, touch, taste, or smell",
        },
        {
          name: "animals",
          displayName: "Animals",
          description: "Any animal names",
        },
        {
          name: "animals2",
          displayName: "Animals",
          description: "Any animal names",
        },
      ],
    },
  ],
};

const SettingsList = ({ gameType }) => {
  const { loading, error, data } = useDummyGetSettingsList(gameType);

  console.log("data", data);

  const settingsList = loading
    ? []
    : data["settings"].map((setting) => (
        <Setting data={setting} key={setting.name} />
      ));

  console.log("setings list", settingsList);

  return (
    <div
      id="settingsList"
      style={{
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {loading && <Loading />}
      {loading || settingsList}
    </div>
  );
};

export default SettingsList;
