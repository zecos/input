import * as React from 'react'
import styles from './GridTest.css'

export const GridTest = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.item1}>Item 1</div>
      <div className={styles.item2}>Item 2</div>
      <div className={styles.item3}>Item 3</div>
      <div className={styles.item4}>Item 4</div>
    </div>
  )
}