import classes from "./InputForm.module.css";

function InputForm(props) {
  return (
    <form className={classes.form__main}>
      <div className={classes.form__input}>
        <label className={classes.label}>Upload Training Data</label>
        <input
          type="file"
          onChange={props.onFileUpload}
          className={classes.file_name}
        />
      </div>
    </form>
  );
}

export default InputForm;
