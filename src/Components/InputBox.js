import React, { useState, useReducer, useCallback } from "react";
import _ from "lodash";

import Card from "./UI/Card";
import classes from "./InputBox.module.css";
import Button from "./UI/Button";
import useRequests from "./Hooks/use-requests";
import SentimentResult from "./SentimentResult";
import NEROutput from "./NEROutput";
import AnswerOutput from "./AnswerOutput";
import SummaryOutput from "./SummaryOutput";
import FillOutput from "./FillOutput";

// import IdentifySentiment from '../logos/Identify Sentiment.jpg';
// import EntityRecognition from '../logos/Entity Recognition.jpg';
// import QuestionAnswering from '../logos/Question Answering.jpg';
// import FillMaskedWord from '../logos/Fill Masked Word.jpg';
// import TextSummarization from '../logos/Text Summarization.jpg';

const BASE_URL = "http://44.199.112.30:8892/";

const reduceTask = (state, action) => {
  const currentState = { ...state };
  if (action.type === "Identify Sentiment") {
    currentState.buttonText = "Identify";
    currentState.displayFills = false;
    currentState.displayContext = false;
    currentState.task = action.type;
    currentState.validateURL = "sentiment_analysis/validate";
    return currentState;
  } else if (action.type === "Question Answering") {
    currentState.buttonText = "Answer";
    currentState.displayFills = false;
    currentState.displayContext = true;
    currentState.task = action.type;
    currentState.validateURL = "question_answering/validate";
    return currentState;
  } else if (action.type === "Entity Recognition") {
    currentState.buttonText = "Recognise";
    currentState.displayContext = false;
    currentState.displayFills = false;
    currentState.task = action.type;
    currentState.validateURL = "named_entity_recognition/validate";
    return currentState;
  } else if (action.type === "Fill Masked Word") {
    currentState.buttonText = "Fill";
    currentState.validateURL = "fill_mask/validate";
    currentState.displayContext = false;
    currentState.displayFills = true;
    currentState.task = action.type;
    return currentState;
  } else if (action.type === "Text Summarization") {
    currentState.buttonText = "Summarize";
    currentState.validateURL = "summarization/validate";
    currentState.displayFills = false;
    currentState.displayContext = false;
    currentState.task = action.type;
    return currentState;
  } else if (action.type === "Update Text") {
    currentState.inputText = action.payload;
    return currentState;
  } else if (action.type === "Update Context") {
    currentState.inputContext = action.payload;
    return currentState;
  }
};

const INIT_STATE = {
  task: "Identify Sentiment",
  buttonText: "Identify",
  validateURL: "sentiment_analysis/validate",
  displayContext: false,
  inputText: "",
  inputContext: "",
};

function InputBox() {
  const [taskState, dispatchTaskState] = useReducer(reduceTask, INIT_STATE);
  const [validInput, setValidInput] = useState(true);
  const [validContext, setValidContext] = useState(true);
  const [inputWords, setInputWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [responseData, setResponseData] = useState({});
  const [sendRequest, isLoading, error] = useRequests(BASE_URL);
  const [showOutputs, setShowOutputs] = useState(false);

  const [selectedTask, setSelectedTask] = useState("sentiment");
  
  const [classificationList, setClassifications] = useState([
    {
      text: 'Identify Sentiment',
      value: 'sentiment',
      //image: IdentifySentiment,
      active: true
    },
    {
      text: 'Entity Recognition',
      value: 'ner',
      //image: EntityRecognition,
      active: false
    },
    {
      text: 'Question Answering',
      value: 'qa',
      //image: QuestionAnswering,
      active: false
    },
    {
      text: 'Fill Masked Word',
      value: 'mask-fill',
      //image: FillMaskedWord,
      active: false
    },
    {
      text: 'Text Summarization',
      value: 'summary',
      //image: TextSummarization,
      active: false
    }
  ]);

  const onClassificationValue = (value) => {
    dispatchTaskState({ type: value });
    setShowOutputs(false);
    setValidInput(true);
    setSelectedTask(value);
    setClassifications(_.map(classificationList, (x) => {
      x.active = (x.text === value);
      return x;
    }));
  };
    
  const getSelectBox = () => {
    return _.map(classificationList, (x) => {
      return (
        <div key={x.value} className={"card col-md-3 col-sm-6 col-12 m-1" + (x.active ? " active" : "")} onClick={() => onClassificationValue(x.text)}>
          {/* <img className="card-img-top w-100" src={x.image} alt={x.text} /> */}
          <div className="card-body">
            <p className="card-text">
              {x.text}
            </p>
          </div>
        </div>
      );
    });
  }

  const processData = useCallback((data) => {
    setResponseData(data);
  }, []);

  const updateText = (event) => {
    dispatchTaskState({ type: "Update Text", payload: event.target.value });
    if (event.target.value) setValidInput(true);
    setShowOutputs(false);

    if (event.target.value) {
      setInputWords(event.target.value.split(" "));
    } else {
      setInputWords([]);
      setSelectedWord(null);
    }
  };

  const updateContext = (event) => {
    dispatchTaskState({ type: "Update Context", payload: event.target.value });
    if (event.target.value) setValidContext(true);
  };

  const onSubmit = () => {
    if (!taskState.inputText) {
      setValidInput(false);
      return;
    }
    if (!taskState.inputContext) {
      setValidContext(false);
      if (taskState.task === "Question Answering") return;
    }
    const bodyData = {};
    if (taskState.task === "Fill Masked Word")
      bodyData.text = taskState.inputText.replace(selectedWord, "[MASK]");
    else bodyData.text = taskState.inputText;
    if (taskState.inputContext) bodyData.context = taskState.inputContext;

    sendRequest(
      {
        url: taskState.validateURL,
        method: "POST",
        body: JSON.stringify(bodyData),
        headers: {
          "Content-Type": "application/json",
        },
      },
      processData
    );

    setShowOutputs(true);
  };

  const onSelectWord = (event) => {
    setSelectedWord(event.target.value);
  };

  return (
    <React.Fragment>
      <Card className={classes.input}>
        <div className="row select-modes mb-3">
          {getSelectBox()}
        </div>
        <div className={classes.input__text + " form-group"}>
          <label className={classes.text__label}>Input Text </label>
          <textarea
            placeholder="Type something here...."
            onChange={updateText}
            value={taskState.inputText}
            className={!validInput ? `form-control ${classes.invalid}` : "form-control"}
          ></textarea>
        </div>
        <div
          className={classes.fills + " form-group"}
          style={{ height: taskState.displayFills ? "auto" : "0px" }}
        >
          <div className={classes.fills__header}>
            {selectedWord ? (
              <p>
                Masked Input: &nbsp;
                <strong>
                  {taskState.inputText.replace(selectedWord, "[MASK]")}
                </strong>
              </p>
            ) : (
              <p>Select word to mask </p>
            )}
          </div>

          <div className={classes.fillTags}>
            {inputWords &&
              inputWords.map((word) => {
                if (word)
                  return (
                    <React.Fragment key={inputWords.indexOf(word)}>
                      <input
                        type="radio"
                        id={word}
                        name="fill"
                        value={word}
                        onChange={onSelectWord}
                        checked={selectedWord === word}
                      />
                      <label htmlFor={word}>
                        <div>{word}</div>
                      </label>
                    </React.Fragment>
                  );
              })}
          </div>
        </div>

        <div
          className={classes.input__text + " form-group"}
          style={{ height: taskState.displayContext ? "300px" : "0px" }}
        >
          <label
            className={classes.text__label}
            onChange={updateContext}
            value={taskState.inputContext}
          >
            Context
          </label>
          <textarea
            placeholder="Type something here...."
            onChange={updateContext}
            value={taskState.inputContext}
            className={!validContext ? `form-control ${classes.invalid}` : "form-control"}
          ></textarea>
        </div>

        <div className="mt-3">
          <Button className="btn btn-success" onClick={onSubmit}>{taskState.buttonText}</Button>
        </div>
      </Card>
      <Card
        className={classes.input__text}
        style={{ height: showOutputs ? "auto" : "0px" }}
      >
        {taskState.task === "Identify Sentiment" && (
          <SentimentResult
            data={responseData}
            error={error}
            isLoading={isLoading}
          />
        )}
        {taskState.task === "Entity Recognition" && (
          <NEROutput
            data={responseData}
            error={error}
            isLoading={isLoading}
            text={taskState.inputText}
          />
        )}
        {taskState.task === "Question Answering" && (
          <AnswerOutput
            data={responseData}
            error={error}
            isLoading={isLoading}
          />
        )}
        {taskState.task === "Fill Masked Word" && (
          <FillOutput data={responseData} error={error} isLoading={isLoading} />
        )}
        {taskState.task === "Text Summarization" && (
          <SummaryOutput
            data={responseData}
            error={error}
            isLoading={isLoading}
          />
        )}
      </Card>
    </React.Fragment>
  );
}
export default InputBox;
