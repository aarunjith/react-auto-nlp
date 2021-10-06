import React from "react";
import classes from "./SentimentOutput.module.css";

function AnswerOutput({ data, isLoading, error }) {
  if (data) {
    const answer = data.answer;
    return (
      <div className={classes.result}>
        {isLoading && <p>Answering question.....</p>}
        {error && <p>{error}</p>}
        {!isLoading && !error && (
          <span>
            Answer: &nbsp;
            <strong>{answer}</strong>
          </span>
        )}
      </div>
    );
  } else {
    return (
      <div className={classes.result}>
        <p>No answer</p>
      </div>
    );
  }
}

export default AnswerOutput;
