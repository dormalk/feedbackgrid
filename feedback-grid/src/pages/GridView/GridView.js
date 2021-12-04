import React,{useState,useCallback} from 'react';
import Header from '../../shared/components/Header/Header.js';
import Grid from './components/Grid/Grid.js';
import { useParams } from "react-router";
import './GridView.css'
import {useHttpClient} from '../../hooks/http-hook';
import socket from '../../helpers/socket';
import ErrorSnack from '../../shared/components/ErrorSnack/ErrorSnack.js';
import { useNavigate } from 'react-router-dom';


const GridView = () => {
    const { gid } = useParams();
    const [initialized, setInitialized] = useState(false);
    const [visited, setVisited] = useState(true);
    const [connectedUsersCounter, setConnectedUsersCounter] = useState(0);
    const [gridData, setGridData] = useState([]);
    const navigate = useNavigate();
    const { error, sendRequest } = useHttpClient();

    
    const clickInstructions = () => {
        setVisited(true);
        localStorage.setItem('visited', true);
    }

    const getGridById = useCallback(async () => {
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/grid/${gid}`);
            setGridData(responseData.grid.cols);
        } catch (err) {
            navigate('/');
        }
    },[gid,sendRequest,navigate])

    React.useEffect(() => {
        const visited = localStorage.getItem('visited');
        setVisited(visited);
        socket.emit('join', {room: gid});
            

        if(gid && !initialized){
            getGridById();

            socket.on("updateTable", _ => getGridById());

            socket.on("usersCount", count => setConnectedUsersCounter(count));

            setInitialized(true);
        }
    },[gid,getGridById, initialized])

    return <React.Fragment>
            <Header userCounter={connectedUsersCounter}/>
            <Grid   userCounter={connectedUsersCounter}
                    gridData={gridData}/>
                {window.innerWidth < 480 && !visited && 
                    <div id="instructions" onClick={clickInstructions}>
                        <img src={`${process.env.PUBLIC_URL}/assets/icons/swipe.png`} alt="swip"/>
                        <h4>
                            You can swipe left or right to change the column.
                        </h4>
                    </div>
                }
        <ErrorSnack error={error}/>
    </React.Fragment>
}

export default GridView;
