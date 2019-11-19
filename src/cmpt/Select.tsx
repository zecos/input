import * as React from "react";
import styles from "./Select.css";
import groupStyles from "./group.css";
import { propz } from '@zecos/propz'

const camelToTitle = text => {
  const result = text.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const renderOption = ([key, value]) => {
  const label = camelToTitle(key);
  return (
    <option key={key} value={value}>
      {label}
    </option>
  );
};

export const Select = ({opts, options}) => {
  const { label, ...moreProps } = propz(opts);
  const lcLabel = label.toLowerCase();
  return (
    <div className={groupStyles.groupContainer}>
      <div className={groupStyles.formGroup}>
        <label className={styles.textAreaLabel} htmlFor={lcLabel}>
          {label}
        </label>
      <select className={styles.selectGroup} {...moreProps}>
        {Object.entries(options).map(renderOption)}
      </select>
      </div>
    </div>
  );
};
