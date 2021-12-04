import React from 'react';
import './CreateGridPage.css';
import {generateUid} from '../../helpers/uid';
import {useHttpClient} from '../../hooks/http-hook';
import { useNavigate } from 'react-router-dom';
import ErrorSnack from '../../shared/components/ErrorSnack/ErrorSnack';

const CreateGridPage = () => {
    const { error, sendRequest } = useHttpClient();
    let navigate = useNavigate();

    const onClickNewGridButton = async () => {
        const gridId = generateUid();
        try{
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/api/grid/${gridId}`,
                'POST')
            navigate(`/gridview/${gridId}`)
        }catch(err){
            console.error(err);
        }
        
    };

    return <React.Fragment>
        <div className="container">
            <div className="card">
                <h3>FEEDBACK GRID</h3>
                <p><b>FEEDBACK GRID</b>  is a Real-Time grid that allows to you publish the popular canvas and collect anonymous and authentic answers from your participants.</p>
                <hr style={{borderWidth: '0.2px', borderColor: 'lightgrey'}}/>
                <div className="card__footer">
                    <button onClick={onClickNewGridButton} className="btn start">
                        START ONLINE FEEDBACK GRID
                    </button>
                </div>
            </div>
        </div>
        <ErrorSnack error={error}/>
    </React.Fragment>
 
}

export default CreateGridPage;
