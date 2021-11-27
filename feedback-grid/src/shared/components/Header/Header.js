import React,{useState} from "react";
import './Header.css';
import { useParams } from "react-router";
import NotificationSnackbar from '../NotificationSnackbar/NotificationSnackbar';
const iconPath = process.env.PUBLIC_URL + '/assets/icons/';

const Header = ({userCounter}) => {
    const { gid } = useParams();
    const [notificationMessage, setNotificationMessage] = useState(null);

    const onClickRoomNumber = () => {
        navigator.clipboard.writeText(`${window.location.origin}/gridview/${gid}?mode=join`);
        setNotificationMessage('Room url copied to clipboard, now you can share it with others');
        setTimeout(() => {
            setNotificationMessage(null);
        }, 3000);
    }

    return <React.Fragment>
        <header>
            <h1 className="logo">FEEDBACK GRID</h1>
            <div className="room">
                <img src={`${iconPath}/share.png`} alt="share" onClick={onClickRoomNumber}/>
                <div className="viewers">{userCounter}</div>
            </div>
        </header>
        <NotificationSnackbar message={notificationMessage}/>
    </React.Fragment>
}


export default Header;