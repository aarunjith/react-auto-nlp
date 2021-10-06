import React from "react";
import classes from "./NEROutput.module.css";

const NERDict = {
  PER: { name: "Person", color: "blue" },
  MISC: { name: "Miscellaneous", color: "yellow" },
  ORG: { name: "Organisation", color: "pink" },
  LOC: { name: "Location", color: "green" },
};

function NEROutput({ data, isLoading, error, text }) {
  if (data.length) {
    const inputWords = text.split(" ");
    const wordLocations = {};
    inputWords.forEach((word) => {
      wordLocations[word] = {
        start: text.indexOf(word),
        end: text.indexOf(word) + word.length,
      };
    });
    const wordEntities = {};
    data.map((entityDict) => {
      const selectedWord = inputWords.filter((word) => {
        return (
          wordLocations[word].start <= entityDict.start &&
          entityDict.start <= wordLocations[word].end
        );
      });
      console.log(selectedWord);
      wordEntities[selectedWord[0]] = NERDict[entityDict.entity_group];
    });

    if (isLoading)
      return (
        <div className={classes.result}>
          <p>Recognizing Entities</p>
        </div>
      );
    if (!isLoading && error)
      return (
        <div className={classes.result}>
          <p>{error}</p>
        </div>
      );
    if (!isLoading && !error) {
      return (
        <div className={classes.result}>
          <div className={classes.words}>
            {inputWords.map((word) => {
              if (wordEntities[word])
                return (
                  <div
                    className={`${classes.word} ${
                      classes[wordEntities[word].name]
                    }`}
                    key={inputWords.indexOf(word)}
                  >
                    <div className={classes.word__main}>{word}</div>
                    <div className={classes.word__annotation}>
                      {wordEntities[word].name}
                    </div>
                  </div>
                );
              else
                return (
                  <div className={classes.word} key={inputWords.indexOf(word)}>
                    <div className={classes.word__main}>{word}</div>
                  </div>
                );
            })}
          </div>
        </div>
      );
    }
  } else {
    return (
      <div className={classes.result}>
        <p>No entities found</p>
      </div>
    );
  }
}

export default NEROutput;
