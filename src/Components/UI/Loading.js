import React from "react";
import classes from "./Loading.module.css";
import bar from "./icons/bar.svg";

function Loading({ message }) {
  return (
    <div className={classes.icon}>
      <img src={bar} height="128px" />
      <p>{message ? message : "Model Training in Progress ....."}</p>
    </div>
  );
}

export default Loading;
