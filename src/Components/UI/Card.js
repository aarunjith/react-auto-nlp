import React from "react";
import classes from "./Card.module.css";

function Card(props) {
  const classnames = `${props.className} ${classes.card}`;
  return (
    <div className={classnames} style={props.style}>
      {props.children}
    </div>
  );
}

export default Card;
