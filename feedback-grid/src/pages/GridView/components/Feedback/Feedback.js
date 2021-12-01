import React,{useCallback} from "react";
import './Feedback.css'
import Reactions from "../Reactions/Reactions";
import { getMyUid } from "../../../../helpers/uid";
import { isRTL } from "../../../../helpers/text";
const uid = getMyUid();
const Feedback = ({value, reactions,votes,onReaction,createdBy, onDelete, opacityOnHightlight}) => {
    console.log(reactions)
    console.log(votes)
    const handleReaction = useCallback((reaction) => {
        const myVote = votes[uid];
        if(!!myVote && myVote !== ''){
            reactions[myVote]--
        }
        votes[uid] = reaction;
        reactions[reaction]++;
        onReaction({reactions,votes});

    },[onReaction, votes, reactions])


    return <div className="card" style={{opacity: opacityOnHightlight ? '0.6' : '1'}}>
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