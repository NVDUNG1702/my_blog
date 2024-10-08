import React, { useEffect, useState } from 'react'
import { listMessageStore, userStore } from '../../../zustand/store';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Search } from '@mui/icons-material';
import styles from './ChatListStyle.module.scss'
import clsx from 'clsx';
import { socketMessage } from '../../../service/socketMessage';
import { timeAgo } from '../../../utils/format_time';
import { chatAPI } from '../../../service/chatAPI';
import { Navigate, useNavigate } from 'react-router-dom';
const ListChat_component = () => {
    const user = userStore(state => state.user);
    const chatList = listMessageStore(state => state.list);
    const setChatList = listMessageStore(state => state.setList);
    const nav = useNavigate();
    useEffect(() => {
        (async () => {
        })()
    }, [user]);

    const handleShowBoxChat = async (id, userName) => {
        const res = await chatAPI.watchedMessage(id);
        if (res.status === 200) {
            setChatList([...res.data]);
        }
        nav(`/userpanel/chat/@${userName}`);
    }
    return (
        <div className={clsx(styles.container)}>
            <div className='w-100 j_center' style={{ height: '10%' }}>
                <FormControl className={clsx(styles.inputSearch)} sx={{ width: '90%', borderColor: 'white', boxShadow: '1px 1px 5px #dfdfdf' }} variant="outlined" >
                    <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    edge="end"
                                >
                                    <Search />
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                </FormControl>
            </div>
            <div className={clsx(styles.containerList)}>
                {
                    chatList.length === 0 ? (
                        <>
                            <p>chưa có đoạn chat nào</p>
                        </>
                    ) : (
                        chatList.map((item, i) => {
                            // console.log(item);

                            return (
                                <div className={clsx(styles.itemList)}
                                    onClick={() => { handleShowBoxChat(item.id, item.User.userName) }}
                                >
                                    <div className={clsx(styles.avatarContainer)}>
                                        <img src={item.User.avatar} alt="" className={clsx(styles.avatar)} />
                                    </div>
                                    <div>
                                        <span className={clsx(`${item.status === 0 ? 'fw-bold' : 'fw-medium'}`)}>{item.User.fullName}</span>
                                        <p className='p'>{timeAgo(item.updatedAt)}</p>
                                    </div>
                                    <div className={clsx(`${item.status === 0 ? styles.showDots : styles.hiddenDost}`)}>

                                    </div>
                                </div>
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}

export default ListChat_component