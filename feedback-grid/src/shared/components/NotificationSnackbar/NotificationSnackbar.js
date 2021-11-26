import React from "react";
import './NotificationSnackbar.css'
import ReactDOM from 'react-dom';

const NotificationSnackbar = ({message}) => {
    return ReactDOM.createPortal(    
        <div className={`notification-snack ${message ? 'show' : ''}`}>
            <div className="notification-snack__message">
                {message}
            </div>
        </div>,
    document.getElementById('notification-hook'))
}


export default NotificationSnackbar;