import * as React from "react";
import styles from "./text-area.css";
import groupStyles from "./group.css"
import { createInputCreator } from "../create-inputs";

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
export interface IOptions {
  rows?: number
}

export const textArea = createInputCreator(({helpers, state, props}) => {
  const {
    id,
    name,
    label,
    value,
    onChange,
    onBlur,
  } = helpers

  const { touched, errors } = state
  return (
    <div className={groupStyles.groupContainer}>
      <div className={groupStyles.formGroup}>
        <label className={styles.textAreaLabel} htmlFor={name}>
          {label}
        </label>
        {touched && renderErrors(errors)}
        {/* explicit better than implicit */}
        <textarea
          rows={props.rows || 3}
          className={styles.textArea}
          name={name}
          aria-label={label}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          id={id}
        />
      </div>
    </div>
  )
})