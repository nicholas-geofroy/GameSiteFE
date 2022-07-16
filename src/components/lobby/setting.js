import { useState, useRef, useEffect } from "react";
import { EnumInput, EnumDisplay } from "./settings/enum-val";
import { NumberInput, NumberDisplay } from "./settings/number-val";
import Modal from "../modal";

const Setting = ({ data }) => {
  const { name, defaultVal, type } = data;
  const [selectedVal, setSelectedVal] = useState(defaultVal);
  const modalRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const onNewVal = (newVal) => {
    console.log("new val ", newVal);
    setShowModal(false);
    setSelectedVal(newVal);
  };

  var input = "";
  var valDisplay = "";
  switch (type) {
    case "number":
      input = <NumberInput data={data} onSubmit={onNewVal} />;
      valDisplay = <NumberDisplay data={data} value={selectedVal} />;
      break;
    case "enum":
      input = <EnumInput data={data} onSubmit={onNewVal} />;
      valDisplay = <EnumDisplay data={data} value={selectedVal} />;
      break;
  }

  const openModal = (e) => {
    console.log("open modal", e);
    setShowModal(true);
  };

  useEffect(() => {
    const onClick = (e) => {
      const modal = modalRef.current;
      if (
        modal &&
        showModal &&
        e.target !== modal &&
        !modalRef.current.contains(e.target)
      ) {
        setShowModal(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  });

  return (
    <div
      className="settingItem surface"
      style={{
        width: "20%",
        height: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "10px",
        padding: "10px 10px",
        cursor: "pointer",
      }}
      onClick={openModal}
    >
      <h2
        style={{
          textAlign: "center",
          textTransform: "capitalize",
        }}
      >
        {name}:
      </h2>
      {valDisplay}
      <Modal show={showModal} contentRef={modalRef}>
        {input}
      </Modal>
    </div>
  );
};

export default Setting;
