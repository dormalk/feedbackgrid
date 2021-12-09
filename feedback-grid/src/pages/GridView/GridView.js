import React,{useState} from 'react';
import Header from '../../shared/components/Header/Header.js';
import Grid from './components/Grid/Grid.js';
import { useParams } from "react-router";
import './GridView.css'
import {useHttpClient} from '../../hooks/http-hook';
import socket,{disconnect as socketDisconnect, reconnect as socketReconnect} from '../../helpers/socket';
import ErrorSnack from '../../shared/components/ErrorSnack/ErrorSnack.js';
import { useNavigate } from 'react-router-dom';

let isInitialMount = false;

const GridView = () => {
    const { gid } = useParams();
    const navigate = useNavigate();

    const [visited, setVisited] = useState(true);
    const [connectedUsersCounter, setConnectedUsersCounter] = useState(0);
    const [gridData, setGridData] = useState([]);
    const { error, sendRequest } = useHttpClient();

    
    const clickInstructions = () => {
        setVisited(true);
        localStorage.setItem('visited', true);
    }

    React.useEffect(() => {
        const getGridById = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/api/grid/${gid}`);
                if(responseData){
                    setGridData(responseData.grid.cols);
                }
                    
            } catch (err) {
                navigate('/');
            }
        }
        if(!isInitialMount){
            getGridById();
            isInitialMount = true;
        }
        socket.emit('join', {room: gid});
        socket.off("updateTable")
        socket.off("usersCount")
        socket.on("updateTable", _ => getGridById());
        socket.on("usersCount", count => setConnectedUsersCounter(count));
    },[gid, sendRequest, navigate]);
    
    React.useEffect( () => {
        const visited = localStorage.getItem('visited');
        setVisited(visited);
        socketReconnect();
    },[]);

    React.useEffect( () => () => socketDisconnect(), [] );


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
