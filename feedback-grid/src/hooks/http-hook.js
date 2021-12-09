import { useState, useCallback, useRef,useEffect} from "react";
import socket from '../helpers/socket';

export const useHttpClient = () => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = "GET", headers = {}, body = null, {withUpdate} = {withUpdate:false}) => {
        if(isLoading) return;
        setLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);
        try {
            console.log('method',method)
            console.log('url',url)

            const response = await fetch(url, {
                method,
                body: body ? JSON.stringify(body): null,
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                signal: httpAbortCtrl.signal
            });
            const data = await response.json();
            activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl);
            if(!response.ok) {
                console.error(data.message)
                throw new Error(data.message);
            }
            setLoading(false);
            if(withUpdate) {
                socket.emit('updateRequest');
            }
            console.log('response',data)

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

    useEffect(() => {
        const currentActiveHttpRequests = activeHttpRequests.current;
        return () =>{
            currentActiveHttpRequests.forEach(abortCtrl => abortCtrl.abort());
        }
    },[])

    return { isLoading, error, sendRequest,clearError };
}