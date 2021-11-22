import React from 'react';
import ReactDOM from 'react-dom';
import './ErrorSnack.css'

const ErrorSnack = ({ error }) => {
    return ReactDOM.createPortal(    
        <div className={`error-snack ${error ? 'show' : ''}`}>
            <div className="error-snack__message">
                {error}
            </div>

        </div>,
    document.getElementById('error-hook'))
}

export default ErrorSnack;