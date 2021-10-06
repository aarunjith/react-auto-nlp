import React from "react";
import classes from "./ProgressBar.module.css";

function ProgressBar({ currentSteps, totalSteps, style }) {
  const fillPct = (currentSteps * 100) / totalSteps;
  return (
    <div className={classes.bar} style={style}>
      <div className={classes.bar__outer}>
        <div
          className={classes.bar__inner}
          style={{ width: `${fillPct}%` }}
        ></div>
        <div className={classes.labels}>
          <p className={classes.zero}>0%</p>
          <p className={classes.hundred}>100%</p>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;
