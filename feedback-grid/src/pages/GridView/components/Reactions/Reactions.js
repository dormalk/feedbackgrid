import React from 'react';
import './Reactions.css'
const iconPath = process.env.PUBLIC_URL + '/assets/icons/';


const Reactions = ({dislikes,loves,celebrates,evils, onPick}) => {
    return <div className="reactions">

        <div className="reaction" onClick={()=>onPick('loves')}>
            <span>{loves}</span>
            <img    src={`${iconPath}heart-color.png`} 
                    alt="heart"/>
        </div>
        <div className="reaction" onClick={()=>onPick('dislikes')}>
            <span>{dislikes}</span>
            <img    src={`${iconPath}dislike-color.png`} 
                    alt="dislike"/>
        </div>
        <div className="reaction" onClick={()=>onPick('celebrates')}>
            <span>{celebrates}</span>
            <img    src={`${iconPath}confetti-color.png`} 
                    alt="confetti"/>
        </div>
        <div className="reaction" onClick={()=>onPick('evils')}>
            <span>{evils}</span>
            <img    src={`${iconPath}devil-color.png`} 
                    alt="evil"/>
        </div>
        
    </div>
}

export default Reactions;