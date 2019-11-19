import * as React from "react";
import styles from "./Select.css";
import groupStyles from "./group.css";
import { propz } from '@zecos/propz'
import { ReactFieldzActions } from "@zecos/react-fieldz";
import { IFieldzState } from '@zecos/fieldz'

const renderOption = ([key, label]) => {
  return (
    <option key={key} value={key}>
      {label}
    </option>
  );
};

export interface IOptions {
  actions: ReactFieldzActions
  state: IFieldzState
  fieldName: string
  options: {
    [name: string]: string
  }
}

export const Select = ({actions, state, fieldName, options}: IOptions) => {
  const { label, ...moreProps } = propz({actions, state, fieldName});
  const lcLabel = label.toLowerCase();
  return (
    <div className={groupStyles.groupContainer}>
      <div className={groupStyles.formGroup}>
        <label className={styles.label} htmlFor={lcLabel}>
          {label}
        </label>
      <select className={styles.selectGroup} {...moreProps}>
        {Object.entries(options).map(renderOption)}
      </select>
      </div>
    </div>
  );
};
