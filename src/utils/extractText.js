

function extractText(htmlString, limit) {
    const plainText = htmlString.replace(/<[^>]+>/g, '');

    if (plainText.length > limit) {
        return plainText.substring(0, limit) + '...';
    } else {
        return plainText;
    }
}

export { extractText };
