import React,{useState} from 'react';
import Header from '../../shared/components/Header/Header.js';
import Grid from './components/Grid/Grid.js';
import { useParams } from "react-router";
import useGrid from "../../hooks/grid-hook";
import './GridView.css'


const GridView = () => {
    const { gid } = useParams();
    const {isLoading, findCol, onColUpdate,errorMessage, userCounter} = useGrid(gid);
    const [visited, setVisited] = useState(true);
    
    const clickInstructions = () => {
        setVisited(true);
        localStorage.setItem('visited', true);
    }

    React.useEffect(() => {
        const visited = localStorage.getItem('visited');
        setVisited(visited);
    },[])

    return <React.Fragment>
            <Header userCounter={userCounter}/>
            <Grid   isLoading={isLoading} 
                    findCol={findCol}
                    onColUpdate={onColUpdate} 
                    errorMessage={errorMessage}
                />
                {window.innerWidth < 480 && !visited && 
                    <div id="instructions" onClick={clickInstructions}>
                        <img src={`${process.env.PUBLIC_URL}/assets/icons/swipe.png`} alt="swip"/>
                        <h4>
                            You can swipe left or right to change the column.
                        </h4>
                    </div>
                }
    </React.Fragment>
}

export default GridView;
