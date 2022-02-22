import React, { useState, useEffect, useReducer, useCallback } from "react";
import Card from "./UI/Card";
import classes from "./InputBox.module.css";
import Button from "./UI/Button";
import useRequests from "./Hooks/use-requests";
import SentimentResult from "./SentimentResult";
import NEROutput from "./NEROutput";
import AnswerOutput from "./AnswerOutput";
import SummaryOutput from "./SummaryOutput";
import FillOutput from "./FillOutput";
import Modal from "./UI/Modal";
import Loading from "./UI/Loading";
import InputForm from "./InputForm";

const BASE_URL = "http://localhost:8000/";

const reduceTask = (state, action) => {
  const currentState = { ...state };
  if (action.type === "Identify Sentiment") {
    currentState.buttonText = "Identify";
    currentState.displayFills = false;
    currentState.displayContext = false;
    currentState.task = action.type;
    currentState.validateURL = "classification/infer/";
    currentState.trainSupport = true;
    currentState.pretrianedModel = true;
    currentState.trainURL = "classification/train/";
    return currentState;
  } else if (action.type === "Question Answering") {
    currentState.buttonText = "Answer";
    currentState.displayFills = false;
    currentState.displayContext = true;
    currentState.task = action.type;
    currentState.validateURL = "question_answering/infer/";
    currentState.trainSupport = false;
    currentState.pretrianedModel = false;
    currentState.trainURL = "";
    return currentState;
  } else if (action.type === "Entity Recognition") {
    currentState.buttonText = "Recognise";
    currentState.displayContext = false;
    currentState.displayFills = false;
    currentState.task = action.type;
    currentState.validateURL = "named_entity_recognition/infer/";
    currentState.trainSupport = true;
    currentState.pretrianedModel = true;
    currentState.trainURL = "named_entity_recognition/train/";
    return currentState;
  } else if (action.type === "Fill Masked Word") {
    currentState.buttonText = "Fill";
    currentState.validateURL = "fill_mask/infer/";
    currentState.displayContext = false;
    currentState.displayFills = true;
    currentState.task = action.type;
    currentState.trainSupport = false;
    currentState.pretrianedModel = false;
    currentState.trainURL = "";
    return currentState;
  } else if (action.type === "Text Summarization") {
    currentState.buttonText = "Summarize";
    currentState.validateURL = "summarization/infer/";
    currentState.displayFills = false;
    currentState.displayContext = false;
    currentState.task = action.type;
    currentState.trainSupport = false;
    currentState.pretrianedModel = false;
    currentState.trainURL = "";
    return currentState;
  } else if (action.type === "Update Text") {
    currentState.inputText = action.payload;
    return currentState;
  } else if (action.type === "Update Context") {
    currentState.inputContext = action.payload;
    return currentState;
  } else if (action.type === "Update Model Text") {
    currentState.inputModelText = action.payload;
    return currentState;
  }
};

const INIT_STATE = {
  task: "Identify Sentiment",
  buttonText: "Identify",
  validateURL: `classification/infer/`,
  trainURL: "",
  displayContext: false,
  inputText: "",
  inputContext: "",
  inputModelText: "",
  trainSupport: true,
  pretrianedModel: true,
  trainURL: "classification/train/",
};

function InputBox() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [taskState, dispatchTaskState] = useReducer(reduceTask, INIT_STATE);
  const [validInput, setValidInput] = useState(true);
  const [validContext, setValidContext] = useState(true);
  const [validModelText, setValidModelText] = useState(true);
  const [inputWords, setInputWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [responseData, setResponseData] = useState({});
  const [sendRequest, isLoading, error] = useRequests(BASE_URL);
  const [showOutputs, setShowOutputs] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);

  const onChangeTask = (event) => {
    taskState.inputText = '';
    taskState.inputModelText = '';
    taskState.inputContext = '';
    dispatchTaskState({ type: event.target.value });
    setShowOutputs(false);
  };

  const pretrainedChange = () => {
    taskState.pretrianedModel = false;
    onSubmit();
  };

  const onFormSubmit = () => {
    if (taskState.task === "Identify Sentiment" || taskState.task === "Entity Recognition") {
      taskState.pretrianedModel = true;
    } else {
      taskState.pretrianedModel = false;
    }
    onSubmit();
  };

  const hideModal = () => {
    setDisplayModal(false);
  };

  const showModal = () => {
    setDisplayModal(true);
  };

  const processData = useCallback((data) => {
    setResponseData(data);
    console.log('data', data);
  }, []);

  const onFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

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

  const updateModelText = (event) => {
    dispatchTaskState({ type: "Update Model Text", payload: event.target.value });
    if (event.target.value) setValidModelText(true);
  }

  const onSubmit = () => {
    if (!taskState.inputText && taskState.pretrianedModel) {
      setValidInput(false);
      return;
    }

    if (!taskState.inputModelText && !taskState.pretrianedModel) {
      setValidModelText(false);
      return;
    }

    if (!taskState.inputContext) {
      if (taskState.task === "Question Answering") {
        setValidContext(false);
        return;
      }
    }

    const bodyData = {};
    if (taskState.task === "Fill Masked Word")
      bodyData.text = taskState.inputText.replace(selectedWord, "[MASK]");
    else bodyData.text = taskState.inputText;
    if (taskState.inputContext) bodyData.context = taskState.inputContext;
    if(taskState.inputModelText) bodyData.text = taskState.inputModelText

    sendRequest(
      {
        url: taskState.validateURL + taskState.pretrianedModel,
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

  const onTrain = () => {
    setDisplayModal(true);
    const formData = new FormData();
    formData.append("dataframe", selectedFile);
    if (selectedFile) {
      sendRequest(
        {
          url: taskState.trainURL,
          method: "POST",
          body: formData,
          headers: {
            accept: "application/json",
          },
        },
        processData
      );
    }
  };

  const onSelectWord = (event) => {
    setSelectedWord(event.target.value);
  };

  return (
    <React.Fragment>
      {displayModal && (
        <Modal onClick={{ hide: hideModal, show: showModal }}>
          <div className={classes.train__progress}>
            {isLoading && <Loading message="Training in progress....." />}
            {error && error}
            <Button style={{ alignSelf: "center" }} onClick={hideModal}>
              {isLoading ? "Cancel" : "OK"}
            </Button>
          </div>
        </Modal>
      )}
      <Card className={classes.input}>
        <div className={classes.selectors}>
          <select onChange={onChangeTask}>
            <option name="sentiment">Identify Sentiment</option>
            <option name="ner">Entity Recognition</option>
            <option name="qa">Question Answering</option>
            <option name="mask-fill">Fill Masked Word</option>
            <option name="summary">Text Summarization</option>
          </select>
        </div>
        <div className={classes.input__text}>
          <label className={classes.text__label}>Input Text </label>
          <textarea
            placeholder="Type something here...."
            onChange={updateText}
            value={taskState.inputText}
            className={!validInput ? classes.invalid : undefined}
          ></textarea>
        </div>
        <div
          className={classes.fills}
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
          className={classes.input__text}
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
            className={!validContext ? classes.invalid : undefined}
          ></textarea>
        </div>
        
        <div className={classes.items_center}>
          {taskState.trainSupport && (
            <form className={classes.infer__model_selectors}>
              <input
                type="radio"
                value="pretrained"
                id="male"
                name="gender"
                checked
              />
              <label for="male">Pretrained Model</label>
            </form>
          )}
          <Button onClick={onFormSubmit}>{taskState.buttonText}</Button>
        </div>
      </Card>

      <Card
        className={classes.input__text}
        style={{ height: showOutputs ? "auto" : "0px" }}
      >
        {taskState.pretrianedModel && taskState.task === "Identify Sentiment" && (
          <SentimentResult
            data={responseData}
            error={error}
            isLoading={isLoading}
          />
        )}
        {taskState.pretrianedModel && taskState.task === "Entity Recognition" && (
          <NEROutput
            data={responseData}
            error={error}
            isLoading={isLoading}
            text={taskState.inputText}
          />
        )}
      </Card>

      {taskState.trainSupport && (
        <Card className={classes.input}>
          <div className={classes.selectors}>
            {taskState.trainSupport && <InputForm onFileUpload={onFileUpload} />}
          </div>
          <div className={classes.input__text + " " + classes.input_height }>
            {taskState.trainSupport && ( <label className={classes.p_b}>Input Text </label>)}
            {taskState.trainSupport && (
              <textarea
                placeholder="Type something here...."
                onChange={updateModelText}
                value={taskState.inputModelText}
                className={!validModelText ? classes.invalid : undefined}
              ></textarea>
            )}

          </div>
          <div className={classes.action_btn}>
            {taskState.trainSupport && (
              <Button onClick={onTrain}>Train Model</Button>
            )}
            {taskState.trainSupport && (
              <Button value="Your Model" onClick={pretrainedChange}>Identify using your Model</Button>
            )}
          </div>
        </Card>
      )}
      
      <Card
        className={classes.input__text}
        style={{ height: showOutputs ? "auto" : "0px" }}
      >
        {!taskState.pretrianedModel && taskState.task === "Identify Sentiment" && (
          <SentimentResult
            data={responseData}
            error={error}
            isLoading={isLoading}
          />
        )}
        {!taskState.pretrianedModel && taskState.task === "Entity Recognition" && (
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
