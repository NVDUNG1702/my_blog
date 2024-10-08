import React, { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    IconButton,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    styled,
    Menu,
    MenuItem,
} from "@mui/material";
import { FaHeart, FaRegHeart, FaComment, FaReply } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { noteAPI } from "../../service/noteAPI";
import { timeAgo } from "../../utils/format_time";
import { userStore } from "../../zustand/store";
import { mapComments } from "../../utils/mapComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const StyledCard = styled(Card)(({ theme }) => ({
    maxWidth: 600,
    margin: "auto",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
}));

const StyledMedia = styled(CardMedia)({
    paddingTop: "100%",
    width: "100%",
    backgroundSize: "contain",
});

const StyledTextField = styled(TextField)({
    marginTop: "16px",
    marginBottom: "8px",
});

const CommentItem = ({ comment, onReply, level = 0, uID, remove }) => {
    const [showReplies, setShowReplies] = React.useState(false);
    const handleShowReplies = () => setShowReplies(!showReplies);
    const nav = useNavigate()
    const isReply = level === 1;
    const commentPadding = isReply ? "20px" : "0px";
    const [anchorEl, setAnchorEl] = useState(null);

    const handleShowAnchorEl = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const handleProfile = () => { nav(`/userpanel/@${comment.User.userName}/profile`) };

    return (
        <div>
            <ListItem alignItems="flex-start" style={{ paddingLeft: commentPadding }}>
                <ListItemAvatar onClick={handleProfile} sx={{ cursor: 'pointer' }}>
                    <Avatar src={comment.User.avatar} />
                </ListItemAvatar>
                <ListItemText

                    primary={
                        <Typography variant="body2"
                            sx={{ cursor: 'pointer' }}
                        >
                            <span onClick={handleProfile}>{comment.User.fullName
                                ? comment.User.fullName
                                : comment.User.userName}
                            </span>
                        </Typography>
                    }
                    secondary={
                        <>
                            <Typography component="span" variant="body2" color="text.primary">
                                {comment.content}
                            </Typography>
                            <Typography variant="caption" display="block">
                                {new Date(comment.createdAt).toLocaleString()}
                            </Typography>
                            <Button
                                size="small"
                                startIcon={<FaReply />}
                                onClick={() => onReply(comment.id, comment.User)}
                            >
                                Reply
                            </Button>
                            {comment.replies && comment.replies.length > 0 && (
                                <Button onClick={handleShowReplies}>
                                    {showReplies ? "Hide replies" : "Show replies"}
                                </Button>
                            )}
                        </>
                    }
                />
                <div>
                    <IconButton
                        aria-label="more"
                        aria-controls="menu_note"
                        aria-haspopup="true"
                        onClick={handleShowAnchorEl}
                    >
                        {/* <MoreVertIcon /> */}
                        <FontAwesomeIcon icon={faEllipsisV} />
                    </IconButton>
                </div>
            </ListItem>

            {/* Hiển thị comment con nếu có */}
            {showReplies && comment.replies && comment.replies.length > 0 && (
                <div style={{ marginLeft: "20px" }}>
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            level={1}
                        />
                    ))}
                </div>
            )}

            <Menu
                id="menu_note"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {
                    uID === comment.User.id && (<MenuItem onClick={() => { remove(comment.id) }}> remove comment</MenuItem>)
                }
                <MenuItem>report comment</MenuItem>
            </Menu>
        </div >
    );
};

const NoteDetails = () => {
    const { idNote, userName } = useParams();
    const [liked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [note, setNote] = useState(null);
    const [comments, setComments] = useState(null);
    const [commentCount, setCommentCount] = useState(0);
    const user = userStore((state) => state.user);
    const nav = useNavigate();
    //   console.log(user);
    // console.log(comments);


    useEffect(() => {
        (async () => {
            let res = await noteAPI.getNoteByID(idNote);
            console.log(res);

            if (res.status === 200) {
                const media = JSON.parse(res.data.media);
                // console.log(res);
                res.data.media = media;
                setLikeCount(res.data.like);
                setNote(res.data);
                setComments(res.comments);
                setCommentCount(res.data.comment);
                const resCheckLike = await noteAPI.checkLike(res.data.id);
                if (resCheckLike.status === 200) {
                    setIsLiked(resCheckLike.check);
                }
            }
        })();
    }, []);

    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);

    const handleLike = async () => {
        const res = await noteAPI.likeNote(note.id);
        console.log(res);

        if (res.status === 201) {
            setIsLiked(true);
            setLikeCount(likeCount + 1);
        } else if (res.status === 200) {
            setIsLiked(false);
            setLikeCount(likeCount - 1);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            let res = {};
            if (replyingTo) {
                res = await noteAPI.addComment({
                    uID: user.id,
                    content: newComment,
                    parentID: replyingTo.id,
                    noteID: idNote,
                });
            } else {
                res = await noteAPI.addComment({
                    uID: user.id,
                    content: newComment,
                    noteID: idNote,
                });
            }
            //   console.log(res);
            console.log(res.data);

            if (res.status === 200) {
                setComments([...comments, res.data]);
                setCommentCount(commentCount + 1);
            }

            //   setComments([...comments, re])
            setNewComment("");
            setReplyingTo(null);
        }
    };

    const handleReply = (commentId, user) => {
        setReplyingTo({ id: commentId, user });
    };

    const handleRemoveItem = async (id) => {
        const res = await noteAPI.deleteComments(id);
        console.log(res);

        if (res.status === 200) {
            const newComments = comments.filter(item => !res.data.includes(item.id));
            setComments(newComments)
        }
    }

    const handleProfile = () => { nav(`/userpanel/${userName}/profile`) };

    return (
        note !== null && (
            <StyledCard>
                <CardHeader
                    avatar={<Avatar src={note.User.avatar} />}
                    title={note.User.fullName}
                    subheader={timeAgo(note.createdAt)}
                    onClick={handleProfile}
                    sx={{ cursor: 'pointer' }}
                />
                <CardContent>
                    <Typography variant="body1" color="text.primary">
                        {note.content}
                    </Typography>
                </CardContent>
                {note.media.type === "mp4" ? (
                    <video width="100%" height="auto" controls>
                        <source src={note.media.linkMedia} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <StyledMedia image={note.media.linkMedia} title="Note Media" />
                )}

                <CardActions disableSpacing>
                    <IconButton aria-label="like" onClick={handleLike}>
                        {liked ? <FaHeart color="red" /> : <FaRegHeart />}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {likeCount} likes
                    </Typography>
                    <IconButton aria-label="comment">
                        <label htmlFor="inputComment">
                            <FaComment />
                        </label>
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {commentCount} comments
                    </Typography>
                </CardActions>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Comments
                    </Typography>
                    <List>
                        {comments &&
                            mapComments(comments).map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    onReply={handleReply}
                                    uID={user.id}
                                    remove={handleRemoveItem}
                                />
                            ))}
                    </List>
                    <form onSubmit={handleCommentSubmit}>
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            placeholder={
                                replyingTo
                                    ? `Write a reply ${replyingTo.user.fullName
                                        ? replyingTo.user.fullName
                                        : replyingTo.user.userName
                                    }`
                                    : "Add a comment..."
                            }
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            id="inputComment"
                        />
                        <Box display="flex" justifyContent="flex-end">
                            {replyingTo && (
                                <Button
                                    onClick={() => setReplyingTo(null)}
                                    style={{ marginRight: 8 }}
                                >
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" variant="contained" color="primary">
                                {replyingTo ? "Post Reply" : "Post Comment"}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </StyledCard>
        )
    );
};

export default NoteDetails;
