import React from 'react'
import clsx from 'clsx';
import styles from './ChatStyle.module.scss';
import { Outlet } from 'react-router-dom';
const Chat_components = () => {
  return (
    <div style={{}} className={clsx(styles.container)}>
      <Outlet />
    </div>
  )
}

export default Chat_components