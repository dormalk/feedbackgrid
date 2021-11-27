import React from 'react';
import './CreateGridPage.css';
import { Link } from "react-router-dom";
import {generateUid} from '../../helpers/uid';

const CreateGridPage = () => {
    return <div className="container">
        <div className="card">
            <h3>FEEDBACK GRID</h3>
            <p><b>FEEDBACK GRID</b>  is a Real-Time grid that allows to you publish the popular canvas and collect anonymous and authentic answers from your participants.</p>
            <hr style={{borderWidth: '0.2px', borderColor: 'lightgrey'}}/>
            <div className="card__footer">
                <Link to={`/gridview/${generateUid()}?mode=new`} className="btn start">
                    START ONLINE FEEDBACK GRID
                </Link>
                {/* <div className="or-dlimeter">or</div>
                <div className="join-wrapper">
                    <input type="text" className="join-input" onChange={handleInputChange}/>
                    <button href={null} onClick={handleNavigate} className="btn join" disabled={gridId === '' || gridId === undefined}>
                        JOIN NOW
                    </button>
                </div> */}

            </div>
        </div>
    </div>
 
}

export default CreateGridPage;
