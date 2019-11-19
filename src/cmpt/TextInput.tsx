import * as React from "react";
import styles from "./TextInput.css";
import groupStyles from "./group.css";
import { propz } from "@zecos/propz";

const renderError = error => <div className={styles.error}>{error.toString()}</div>
const renderErrors = errors => {
  if (!errors.length) {
    return ""
  }
  return (
    <div className={styles.errors}>
      {errors.map(renderError)}
    </div>
  )
}
export const TextInput = ({opts}) => {
  const { label, ...moreProps } = propz(opts);
  const { touched, errors } = opts.state[opts.fieldName]
  const lcLabel = label.toLowerCase();

  return (
    <div className={groupStyles.groupContainer}>
      <div className={groupStyles.formGroup}>
        <label className={styles.textLabel} htmlFor={lcLabel}>
          {label}
        {touched && renderErrors(errors)}
        </label>
        <input
          className={styles.textInput}
          name={lcLabel}
          aria-label={label}
          {...moreProps}
        />
      </div>
    </div>
  );
};
