import React from "react";
import classses from "./Modal.module.css";
import ReactDOM from "react-dom";

const Backdrop = (props) => {
  return <div className={classses.backdrop} onClick={props.onClick}></div>;
};
const ModalOverlay = (props) => {
  return (
    <div className={classses.modal}>
      <div className={classses.content}>{props.children}</div>
    </div>
  );
};

function Modal(props) {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <Backdrop onClick={props.onClick.hide} />,
        document.getElementById("modal__backdrop")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay>{props.children}</ModalOverlay>,
        document.getElementById("modal__main")
      )}
    </React.Fragment>
  );
}

export default Modal;
