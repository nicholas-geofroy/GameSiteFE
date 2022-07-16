import { CloseButton } from "react-bootstrap";

const Modal = ({ show, contentRef, children }) => {
  const display = show ? "block" : "none";
  return (
    <div
      className="modal"
      style={{
        display: display,
        position: "fixed",
        zIndex: "1",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "auto",
        backgroundColor: "rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="modalContent surfaceOpaque"
        style={{
          margin: "50px 10%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
        ref={contentRef}
      >
        <CloseButton
          style={{
            position: "absolute",
            marginRight: "10%",
            right: "10px",
            top: "55px",
          }}
          variant="white"
        />
        {show && children}
      </div>
    </div>
  );
};

export default Modal;
