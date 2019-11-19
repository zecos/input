import * as React from "react";
import styles from "./TextArea.css";
import groupStyles from "./group.css"
import { propz } from '@zecos/propz'
import { ReactFieldzActions } from "@zecos/react-fieldz";
import { IFieldzState } from '@zecos/fieldz'

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
  actions: ReactFieldzActions
  state: IFieldzState
  fieldName: string
}

export const TextArea = ({actions, state, fieldName}: IOptions) => {
  const { label, ...moreProps } = propz({actions, state, fieldName});
  const { touched, errors } = state[fieldName]
  const lcLabel = label.toLowerCase();
  return (
    <div className={groupStyles.groupContainer}>
      <div className={groupStyles.formGroup}>
        <label className={styles.textAreaLabel} htmlFor={lcLabel}>
          {label}
        </label>
        {touched && renderErrors(errors)}
        <textarea
          className={styles.textArea}
          name={lcLabel}
          aria-label={label}
          {...moreProps}
        />
      </div>
    </div>
  );
};
