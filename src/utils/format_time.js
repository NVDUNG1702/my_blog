
function timeAgo(dateString) {
    const currentTime = new Date(); // Lấy thời gian hiện tại
    const pastTime = new Date(dateString); // Chuyển chuỗi thời gian thành đối tượng Date

    const seconds = Math.floor((currentTime - pastTime) / 1000); // Tính số giây trôi qua
    let interval = Math.floor(seconds / 31536000); // Kiểm tra năm

    if (interval >= 1) {
        return `${interval}y`;
    }
    interval = Math.floor(seconds / 2592000); // Kiểm tra tháng
    if (interval >= 1) {
        return `${interval}m`;
    }
    interval = Math.floor(seconds / 86400); // Kiểm tra ngày

    if (interval >= 1) {
        return `${interval}day`;
    }
    interval = Math.floor(seconds / 3600); // Kiểm tra giờ
    if (interval >= 1) {
        return `${interval}h`;
    }
    interval = Math.floor(seconds / 60); // Kiểm tra phút
    if (interval >= 1) {
        return `${interval}min`;
    }
    return `${Math.floor(seconds)}s`; // Mặc định là giây
}


export { timeAgo };