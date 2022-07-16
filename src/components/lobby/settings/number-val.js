import { useState } from "react";

export const NumberInput = ({ data, onSubmit }) => {
  const [value, setValue] = useState(parseInt(data.default));
  const [showWarning, setShowWarning] = useState(false);

  const onInput = (e) => {
    setValue(e.target.value);
  };

  const onSubmitEvent = (e) => {
    if (isInt(value)) {
      const intVal = parseInt(value);
      setShowWarning(false);
      onSubmit(intVal);
    } else {
      setShowWarning(true);
    }
    e.stopPropagation();
    return false;
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      onSubmitEvent(e);
    }
  };

  return (
    <div
      className="numberInput"
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          marginBottom: "10px",
          textTransform: "capitalize",
        }}
      >
        {data.name}
      </h1>
      <h3>{data.description}</h3>
      <input
        className="input primaryText"
        type="number"
        value={value}
        onChange={onInput}
        style={{
          width: "50em",
        }}
        onKeyDown={onKeyDown}
        onSubmit={onSubmitEvent}
      ></input>
      {showWarning && (
        <span style={{ color: "red" }}>Value must be an integer</span>
      )}
      <button
        className="button primary"
        onClick={onSubmitEvent}
        style={{
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        Submit
      </button>
    </div>
  );
};

function isInt(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseInt(str))
  ); // ...and ensure strings of whitespace fail
}

export const NumberDisplay = ({ data, value }) => {
  return (
    <>
      <span
        style={{
          textAlign: "center",
        }}
      >
        <h2>{value}</h2>
      </span>
    </>
  );
};
