import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { messageStore, userStore } from '../../../zustand/store';
import { chatAPI } from '../../../service/chatAPI';
import styles from './ChatBoxStyle.module.scss';
import clsx from 'clsx';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Send } from '@mui/icons-material';



const ChatComponent = ({ message, user }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'auto' });
        }
    }, [message]);
    if (!Array.isArray(message)) {
        return <div>No messages found.</div>; // Or handle it appropriately
    }
    return (
        <div className={clsx(styles.containerMessage)} >
            {message.map((item) => (
                <div
                    key={item.id}
                    style={{
                        display: 'flex',
                        justifyContent: item.senderID === user.id ? 'flex-end' : 'flex-start',
                        marginBottom: '10px'
                    }}
                >
                    <div
                        style={{
                            backgroundColor: item.senderID === user.id ? '#DCF8C6' : '#FFF',
                            padding: '10px',
                            borderRadius: '15px',
                            maxWidth: '50%',
                            wordWrap: 'break-word',
                            position: 'relative'
                        }}
                    >
                        <div>{item.content}</div>
                        <div
                            style={{
                                fontSize: '10px',
                                color: '#888',
                                marginTop: '5px',
                                textAlign: item.senderID === user.id ? 'right' : 'left'
                            }}
                        >
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
};

const ChatBox_component = () => {
    const { userName } = useParams();
    const user = userStore(state => state.user);
    const message = messageStore(state => state.list);
    const setMessage = messageStore(state => state.setList);
    const [userFind, setUserFind] = useState(null);
    // const [errorAvatar, setErrorAvatar] = useState(false);
    const [newMessage, setNewMessage] = useState('');

    const [showMenu, setShowMenu] = useState(null);

    const handleShowMenu = (event) => {
        event.stopPropagation();
        setShowMenu(event.currentTarget);
    };

    const handleCloseMenu = (event) => {
        event.stopPropagation();
        setShowMenu(null);
    };

    useEffect(() => {
        (async () => {
            const res = await chatAPI.getMessage(userName.substring(1));
            if (res.status === 200) {
                setMessage(res.data.message);
                setUserFind(res.data.user);
            }
        })();
    }, []);
    // useEffect(() => {
    //     console.log(message);

    // }, [message]);

    const handleSendMessage = async () => {
        if (!userFind || newMessage.trim() === '') { return }
        const res = await chatAPI.sendMessage({ senderID: user.id, receiverID: userFind.id, content: newMessage });
        // console.log(res);

        if (res.status === 201) {
            setMessage([...message, res.data])

        }
        setNewMessage('');
    }

    return (
        userFind !== null ? (
            <div className={clsx(styles.container)}>
                <div className={clsx(styles.menuContainer)}>
                    <div style={{ height: '100%', width: '50%' }} className={clsx(styles.menuLeftContainer)}>
                        {/* <img src={userFind.avatar} alt="" className={clsx(styles.avatar)} /> */}
                        <div className={clsx(styles.avatar, 'j_center')}>
                            <img src={userFind.avatar} alt="" className={clsx()} style={{ width: '100%' }} />
                        </div>
                        {/* <div style={{ height: '90%' }}> */}
                        <span className={clsx('ms-2 fw-bold text-white')}>{userFind.fullName}</span>
                        {/* </div> */}
                    </div>
                    <div>
                        <IconButton
                            aria-label="more"
                            aria-controls="menu_note"
                            aria-haspopup="true"
                            onClick={handleShowMenu}
                        >
                            {/* <MoreVertIcon /> */}
                            <FontAwesomeIcon color='white' icon={faEllipsisV} />
                        </IconButton>
                    </div>
                </div>
                {/* <div className={clsx(styles.containerMessage)}>
                    {message.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                display: 'flex',
                                justifyContent: item.senderID === user.id ? 'flex-end' : 'flex-start',
                                marginBottom: '10px'
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: item.senderID === user.id ? '#DCF8C6' : '#FFF',
                                    padding: '10px',
                                    borderRadius: '15px',
                                    maxWidth: '50%',
                                    wordWrap: 'break-word',
                                    position: 'relative'
                                }}
                            >
                                <div>{item.content}</div>
                                <div
                                    style={{
                                        fontSize: '10px',
                                        color: '#888',
                                        marginTop: '5px',
                                        textAlign: item.senderID === user.id ? 'right' : 'left'
                                    }}
                                >
                                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div> */}
                {
                    Array.isArray(message) && <ChatComponent message={message} user={user} />
                }
                <div className={clsx(styles.containerInput)}>
                    <input type="text" className={clsx(styles.input)} placeholder='Nhập tin nhắn...'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button sx={{ width: '10%', height: '100%', color: 'white' }} endIcon={<Send fontSize='large' color='string' sx={{ color: 'white' }} />}
                        onClick={handleSendMessage}
                    >
                        send
                    </Button>

                </div>
                <Menu
                    id="menu_note"
                    anchorEl={showMenu}
                    keepMounted
                    open={Boolean(showMenu)}
                    onClose={handleCloseMenu}
                >
                    <MenuItem >remove note</MenuItem>
                    <MenuItem>add favorite</MenuItem>
                </Menu>
            </div>
        ) : (<></>)
    )
}

export default ChatBox_component