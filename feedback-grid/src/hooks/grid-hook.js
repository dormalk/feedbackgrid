import {useState,useEffect,useCallback} from 'react';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import { getMyUid } from "../helpers/uid";
const uid = getMyUid();

const socket = socketIOClient(process.env.REACT_APP_BACKEND_URL);


const useGrid = (gid) => {
    const [gridId, setGridId] = useState();
    const [gridCols, setGridCols] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState();
    const [userCounter, setUserCounter] = useState(0);


    const mode = new URLSearchParams(useLocation().search).get('mode');
    let navigate = useNavigate();
    const fetchGrid = useCallback((gid) => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/grid/${gid}`)
        .then(res => res.json())
        .then(res => {
            const updatedGrid = [
                ...gridCols.map(col => {
                    for(let key in col.votes){
                        if(key === uid){
                            delete col.votes[key];
                        }
                    }
                    return col;
                }),
                ...res.grid.cols.map(col => {
                    for(let key in col.votes){
                        if(key !== uid){
                            delete col.votes[key];
                        }
                    }
                    return col;
                })
            ] 
            console.log(updatedGrid)
            setGridCols(updatedGrid)
        })
        .catch(err => {
            console.log(err)
            if(mode === 'new') updateErrorMessage('We Could not fetch grid, please check you connection');
            else if(mode === 'join') navigate('/');
        })
        .finally(() => setIsLoading(false))
    },[mode,navigate])

    const initGrid = useCallback(() => {
        if(gid !== null) {
            setGridId(gid)
            fetchGrid(gid);
            socket.emit('join', {room: gid});
    
            socket.on("updateTable", _ => {
                fetchGrid(gid);
            });

            socket.on("usersCount", count => {
                setUserCounter(count);
            });
        } else {
            updateErrorMessage("Grid not found");
        }
    },[gid,fetchGrid]);

    useEffect(() => {
        initGrid();
    },[initGrid])

    

 

    const findCol = (id) => {
        const col = gridCols.find(col => col.name === id)
        if(col) return col.feedbacks;
        return []
    }

    const onColUpdate = useCallback((id, feedbacks) => {
        const tempCols = gridCols;
        const col = tempCols.find(col => col.name === id)
        if(col) {
            setGridCols([...tempCols])
            col.feedbacks = feedbacks;
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/grid/${gridId}`, {
                method: 'POST',
                body: JSON.stringify({
                    grid: {
                        cols: tempCols
                    }}),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(_ => {
                socket.emit('updateRequest');
            })
            .catch(err => console.log(err))
        }
    },[gridCols, gridId])


    const updateErrorMessage = (msg) => {
        setErrorMessage(msg);
        setTimeout(() => {
            setErrorMessage(null);
        },3000)
    }

    return {isLoading, findCol, onColUpdate, errorMessage,userCounter}
}


export default useGrid;