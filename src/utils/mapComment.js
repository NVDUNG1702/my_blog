
const mapComments = (comments) => {
    // Tạo một map để chứa các replies theo comment id
    const commentMap = {};

    // Khởi tạo tất cả các comment vào map và đồng thời tạo key "replies"
    comments.forEach((comment) => {
        commentMap[comment.id] = {
            id: comment.id,
            content: comment.content,
            uID: comment.uID,
            noteID: comment.noteID,
            parentID: comment.parentID,
            createdAt: comment.createdAt,
            User: comment.User,
            replies: [],
        };
    });

    // Phân chia các comment vào đúng chỗ trong map
    const rootComments = [];
    comments.forEach((comment) => {
        if (comment.parentID) {
            // Nếu có parentCommentID thì thêm nó vào replies của comment đó
            commentMap[comment.parentID].replies.push(commentMap[comment.id]);
        } else {
            // Nếu không có parentCommentID thì đây là comment cấp cao nhất
            rootComments.push(commentMap[comment.id]);
        }
    });

    return rootComments;
};

export { mapComments }