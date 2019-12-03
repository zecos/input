import * as React from "react";
import styles from "./text.css";
import groupStyles from "./group.css";
import { createInputCreator } from "../create-inputs";

const renderError = error => <div key={error.toString()} className={styles.error}>{error.toString()}</div>
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

export const text = createInputCreator(({helpers, state}) => {
    const {
      id,
      name,
      label,
      value,
      onChange,
      onBlur,
    } = helpers
    
    const {touched, errors} = state
    return (
      <div className={groupStyles.groupContainer}>
        <div className={groupStyles.formGroup}>
          <label className={styles.textLabel} htmlFor={name}>
            {label}
          {touched && renderErrors(errors)}
          </label>
          <input
            className={styles.textInput}
            name={name}
            aria-label={label}
            value={value}
            onChange={onChange}
            onBlur={e => {
              onBlur(e)
            }}
            id={id}
          />
        </div>
      </div>
    )
})