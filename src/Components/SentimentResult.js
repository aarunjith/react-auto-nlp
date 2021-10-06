import React from "react";
import classes from "./SentimentOutput.module.css";

function SentimentResult({ data, isLoading, error }) {
  if (data) {
    return (
      <div className={classes.result}>
        {isLoading && <p>Analysing Sentiment ....</p>}
        {error && <p>{error}</p>}
        {!isLoading && !error && (
          <p>
            This text has a&nbsp;
            <strong>
              <span
                style={{ color: data.label === "POSITIVE" ? "green" : "red" }}
              >
                {data.label}
              </span>
            </strong>
            &nbsp; sentiment with Confidence{" "}
            <strong>{(data.score * 100).toFixed(1)}%</strong>
          </p>
        )}
      </div>
    );
  } else {
    return (
      <div className={classes.result}>
        <p>Sentiment not identified</p>
      </div>
    );
  }
}

export default SentimentResult;
