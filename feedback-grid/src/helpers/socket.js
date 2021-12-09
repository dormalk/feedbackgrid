import socketIOClient from "socket.io-client";


let socket;
if(socket === undefined) {
    socket = socketIOClient(process.env.REACT_APP_BACKEND_URL);
}

export const disconnect = () => {
    if(socket !== undefined) {
        console.log('socketIOClient disconnect');
        socket.close();
    }
}

export const reconnect = () => {
    if(socket !== undefined) {
        console.log('reconnecting');
        socket.open();
    }
}



export default socket;
