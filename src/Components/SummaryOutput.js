import React from "react";
import classes from "./SentimentOutput.module.css";
function SummaryOutput({ data, isLoading, error }) {
  if (data.length) {
    const summary = data[0].summary_text;
    return (
      <div className={classes.result}>
        {isLoading && <p>Summarizing text ....</p>}
        {error && <p>{error}</p>}
        {!isLoading && !error && (
          <span>
            <strong>Summary: &nbsp;</strong>
            <p>{summary}</p>
          </span>
        )}
      </div>
    );
  } else {
    return (
      <div className={classes.result}>
        <p>Summary not extracted</p>
      </div>
    );
  }
}

export default SummaryOutput;
