import React from "react";
import './Header.css';
import { useParams } from "react-router";

const Header = () => {
    const { gid } = useParams();

    return (
        <header>
            <h1 className="logo">FEEDBACK GRID</h1>
            <div className="room">Room  <span>{gid}</span></div>
        </header>
    );
}


export default Header;