import classes from "./App.module.css";
import InputBox from "./Components/InputBox";
function App() {
  return (
    <section className={classes.main}>
      <div className={classes.header}>
        <h2>FlowML - AutoNLP</h2>
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
