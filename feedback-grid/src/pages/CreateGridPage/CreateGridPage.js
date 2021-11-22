import React from 'react';
import './CreateGridPage.css';
import { Link } from "react-router-dom";
import {generateUid} from '../../helpers/uid';
import { useNavigate } from 'react-router-dom';

const CreateGridPage = () => {
    const [gridId, setGridId] = React.useState();
    const navigate = useNavigate();
    const handleInputChange = (e) => {
        setGridId(e.target.value)
    }

    const handleNavigate = () => {
        if(gridId === '' || gridId === undefined) {
            alert('Please enter a grid id')
        } else {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/grid/check/${gridId}`)
            .then(res => {
                if(!res.ok) throw new Error('Grid does not exist')
                else navigate(`/gridview/${gridId}?mode=join`) 
            })
            .catch(err => alert(err))
        }
    
    }

    return <div className="container">
        <div className="card">
            <h3>FEEDBACK GRID</h3>
            <p>With online <b>FEEDBACK GRID</b> you can create interactive grid to qustions your team and get anonynus and authentic feedback.</p>
            <hr style={{borderWidth: '0.2px', borderColor: 'lightgrey'}}/>
            <div className="card__footer">
                <Link to={`/gridview/${generateUid()}?mode=new`} className="btn start">
                    START ONLINE FEEDBACK GRID
                </Link>
                <div className="or-dlimeter">or</div>
                <div className="join-wrapper">
                    <input type="text" className="join-input" onChange={handleInputChange}/>
                    <button href={null} onClick={handleNavigate} className="btn join" disabled={gridId === '' || gridId === undefined}>
                        JOIN NOW
                    </button>
                </div>

            </div>
        </div>
    </div>
 
}

export default CreateGridPage;
