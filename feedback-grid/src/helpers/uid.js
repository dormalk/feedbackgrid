export const generateUid = () => {
    return Math.random().toString(36).substr(2, 9);
}

export const getMyUid = () => {
    const myUid = localStorage.getItem('myUid');
    if (myUid) {
        return myUid;
    } else {
        const newUid = generateUid();
        localStorage.setItem('myUid', newUid);
        return newUid;
    }
}

export default generateUid;