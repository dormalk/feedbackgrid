import React from "react";
import './Header.css';
import { useParams } from "react-router";
const iconPath = process.env.PUBLIC_URL + '/assets/icons/';

const Header = ({userCounter}) => {
    const { gid } = useParams();
    
    const onClickRoomNumber = () => {
        navigator.clipboard.writeText(`${window.location.origin}/gridview/${gid}?mode=join`);
    }

    return (
        <header>
            <h1 className="logo">FEEDBACK GRID</h1>
            <div className="room">
                <img src={`${iconPath}/share.png`} alt="share" onClick={onClickRoomNumber}/>
                <div className="viewers">{userCounter}</div>
            </div>
        </header>
    );
}


export default Header;