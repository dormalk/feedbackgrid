import React,{useCallback} from "react";
import './Feedback.css'
import Reactions from "../Reactions/Reactions";
import { getMyUid } from "../../../../helpers/uid";
import { isRTL } from "../../../../helpers/text";
const Feedback = ({value, reactions,onReaction,createdBy, onDelete}) => {
    const [myVote, setMyVote] = React.useState('');
    
    const handleReaction = useCallback((reaction) => {
        if(myVote !== ''){
            reactions[myVote]--
        }        
        reactions[reaction]++;
        setMyVote(reaction);
        onReaction(reactions)

    },[onReaction, setMyVote, myVote, reactions])

    return <div className="card" >
        {createdBy === getMyUid() && <div className="card-remove" onClick={onDelete} style={{right: isRTL(value) ? 'unset' : '1rem', left: isRTL(value) ? '1rem' : 'unset'}}>x</div>}
        <div className={`card-body ${isRTL(value) ? 'rtl' : ''}`} >{value}</div>
        <hr/>
        <div className="card-footer">
            <Reactions  evils={reactions.evils} 
                        dislikes={reactions.dislikes}
                        loves={reactions.loves}
                        onPick={handleReaction}
                        celebrates={reactions.celebrates}/>
        </div>
    </div>
}

export default Feedback;