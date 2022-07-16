import { useEffect, useRef, useState } from "react";
import "./dropdown.css";

const Option = ({ name, displayName, description, onClick, selected }) => {
  const className = selected ? "primary" : "secondary";
  return (
    <button onClick={onClick} className={`dropdownOption ${className} button`}>
      {displayName}
    </button>
  );
};

export const EnumInput = ({ data }) => {
  const values = data.values;

  const [valueIdx, setValueIdx] = useState(0);
  const [show, setShow] = useState(false);
  const dropdownButton = useRef(null);

  const options = values.map((option, i) => (
    <Option
      key={option.name}
      onClick={() => {
        setValueIdx(i);
        setShow(false);
      }}
      selected={valueIdx == i}
      {...option}
    />
  ));

  useEffect(() => {
    const onClick = (e) => {
      if (e.target == dropdownButton.current) {
        setShow(!show);
      } else {
        setShow(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  });

  return (
    <div
      className="dropdown"
      style={{
        display: "inline-block",
      }}
    >
      <button className="button primary" ref={dropdownButton}>
        {values[valueIdx].displayName}
      </button>
      {show && <div className="dropdownContent">{options}</div>}
    </div>
  );
};

export const EnumDisplay = ({ data, value }) => {
  const displayName = data.values.find((e) => e.name == value).displayName;
  return (
    <>
      <span
        style={{
          textAlign: "center",
        }}
      >
        <h2>{displayName}</h2>
      </span>
    </>
  );
};
