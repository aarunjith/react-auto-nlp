import React from "react";
import classes from "./SentimentOutput.module.css";
function FillOutput({ data, isLoading, error }) {
  let bestFill = "";
  if (data.length) {
    let bestScore = 0;
    data.map((fillDict) => {
      if (fillDict.score > bestScore) {
        bestScore = fillDict.score;
        bestFill = fillDict.sequence;
      }
    });
    return (
      <div className={classes.result}>
        {isLoading && <p>Summarizing text ....</p>}
        {error && <p>{error}</p>}
        {!isLoading && !error && (
          <span>
            <p>Filled Output: &nbsp;</p>
            <strong>{`${bestFill} (${(bestScore * 100).toFixed(1)}%)`}</strong>
          </span>
        )}
      </div>
    );
  } else {
    return (
      <div className={classes.result}>
        <p>No possible fills</p>
      </div>
    );
  }
}

export default FillOutput;
