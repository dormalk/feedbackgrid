import { useState, useCallback } from "react";
import socket from '../helpers/socket';

export const useHttpClient = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendRequest = useCallback(async (url, method = "GET", headers = {}, body = null, {withUpdate} = {withUpdate:false}) => {
        if(isLoading) return;
        setLoading(true);
        try {
            const response = await fetch(url, {
                method,
                body: body ? JSON.stringify(body): null,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.message);
            }
            setLoading(false);
            if(withUpdate) {
                socket.emit('updateRequest');
            }
            return data;
        } catch (err) {
            setLoading(false);
            setTimeout(() => {
                clearError();
            }, 3000);
            console.error(err)
            setError(err.message || "Something went wrong");
            throw err;
        }
    },[isLoading])

    const clearError = () => {
        setError(null);
    }

    

    return { isLoading, error, sendRequest,clearError };
}