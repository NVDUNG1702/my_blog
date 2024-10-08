
function getFirstImageSrc(htmlString) {
    // Tạo một đối tượng DOM để xử lý chuỗi HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    // Sử dụng querySelector để lấy thẻ img đầu tiên
    const firstImg = tempDiv.querySelector('img');

    // Nếu có thẻ img, trả về giá trị của thuộc tính src
    if (firstImg) {
        return firstImg.src;
    } else {
        return null; // Không có thẻ img nào
    }
}


export { getFirstImageSrc };