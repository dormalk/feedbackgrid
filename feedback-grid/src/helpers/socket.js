import socketIOClient from "socket.io-client";


let socket;
if(socket === undefined) {
    socket = socketIOClient(process.env.REACT_APP_BACKEND_URL);
}

export default socket;
