import * as React from "react";
import styles from "./Select.css";
import groupStyles from "./group.css";
import { propz } from '@zecos/propz'

const renderOption = ([key, label]) => {
  return (
    <option key={key} value={key}>
      {label}
    </option>
  );
};

export const Select = ({actions, state, fieldName, options}) => {
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
