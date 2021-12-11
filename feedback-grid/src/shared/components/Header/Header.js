import React,{useState} from "react";
import './Header.css';
import { useParams } from "react-router";
import NotificationSnackbar from '../NotificationSnackbar/NotificationSnackbar';
const iconPath = process.env.PUBLIC_URL + '/assets/icons/';

const Header = ({userCounter}) => {
    const { gid } = useParams();
    const [notificationMessage, setNotificationMessage] = useState(null);
    const [simulatorIsActive, setSimulatorIsActive] = useState(false);

    const onClickRoomNumber = () => {
        navigator.clipboard.writeText(`${window.location.origin}/gridview/${gid}?mode=join`);
        setNotificationMessage('Room url copied to clipboard, now you can share it with others');
        setTimeout(() => {
            setNotificationMessage(null);
        }, 3000);
    }

    const startSimulator = () => {
        window.dispatchEvent(new CustomEvent('play-simulator'))
        setSimulatorIsActive(true);
    }

    const stopSimulator = () => {
        window.dispatchEvent(new CustomEvent('stop-simulator'))    
        setSimulatorIsActive(false);
    }

    return <React.Fragment>
        <header>
            <h1 className="logo">FEEDBACK GRID</h1>
            <div className="room">
                <div className="simulate-btn">
                    {!simulatorIsActive &&<img src={`${iconPath}/play.png`} alt="play" onClick={startSimulator}/>}
                    {simulatorIsActive &&<img src={`${iconPath}/stop.png`} alt="stop" onClick={stopSimulator}/>}
                </div>
                <div className="share-btn" onClick={onClickRoomNumber}>
                    <span>Get Url to share</span>
                    <img src={`${iconPath}/share.png`} alt="share" />
                </div>
                <div className="viewers">{userCounter}</div>
            </div>
        </header>
        <NotificationSnackbar message={notificationMessage}/>
    </React.Fragment>
}


export default Header;