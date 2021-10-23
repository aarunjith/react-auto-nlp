import classes from "./App.module.css";
import InputBox from "./Components/InputBox";

import './App.css';

function App() {
  return (
    <section className={classes.main}>
      <div className={classes.header + " header-text"}>
        <h2>NLP Capabilities</h2>
        <p>
          Text Sentiment Classification, Filling Missing text, Entity
          Recognition and Summarization
        </p>
      </div>
      <InputBox />
    </section>
  );
}

export default App;
