import classes from "./App.module.css";
import InputBox from "./Components/InputBox";
function App() {
  return (
    <section className={classes.main}>
      <div className={classes.header}>
        <h2>Auto NLP</h2>
        <p>
          Text Sentiment Classification, Filling Missing text, and Entity
          Recognition
        </p>
      </div>
      <InputBox />
    </section>
  );
}

export default App;
