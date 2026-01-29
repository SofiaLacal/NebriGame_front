const getImageUrl = (imageUrl) => {
    return `${import.meta.env.VITE_BACK_CONNECTION}${imageUrl}`;
}

export default getImageUrl;