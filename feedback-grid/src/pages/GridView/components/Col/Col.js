import React,{useRef,useState,useCallback} from "react";
import AddInput from "../AddInput/AddInput";
import Feedback from "../Feedback/Feedback";
import './Col.css'
import {getMyUid} from "../../../../helpers/uid";
import { useHttpClient } from "../../../../hooks/http-hook";
import { useParams } from "react-router";
import ErrorSnack from '../../../../shared/components/ErrorSnack/ErrorSnack';


const iconPath = process.env.PUBLIC_URL + '/assets/icons/';
const HIGHTLIGHT_MODE_PRESENT_VALUE = 0.9;

const calcSumOfReactions = reactions => {
    let sum = 0;
    for(let key in reactions){
        sum += reactions[key];
    }
    return sum;
}

const Col = ({title,icon,feedbacks = [], style={}, userCounter, colId}) => {
    const bodyRef = useRef(null);
    const [highlightMode,setHighlightMode] = useState(false);
    const { error, sendRequest } = useHttpClient();
    const { gid } = useParams();

    React.useEffect(() => {
        let totalReactionsSum = 0;
        feedbacks.forEach(feedback => totalReactionsSum += calcSumOfReactions(feedback.reactions));
        const maxReactionsCount = userCounter * feedbacks.length; 
        if(maxReactionsCount > 0 && totalReactionsSum / maxReactionsCount > HIGHTLIGHT_MODE_PRESENT_VALUE){
            setHighlightMode(true);
        } else {
            setHighlightMode(false);
        }
    },[userCounter,feedbacks])

    const handleNewFeedback = useCallback(async (value) => {
        if(value === '') return;
        
        try{
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/api/grid/${gid}/feedback`,
                'POST',
                undefined,
                {
                    colName: colId,
                    feedback: value,
                    uid: getMyUid()
                }, {withUpdate: true})

            setTimeout(() => {
                bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
            })
        }catch(err){
            console.error(err);
        }

    },[colId,gid,sendRequest])

    const deleteFeedbackById = useCallback(async(feedbackId) => {
        try{
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/api/grid/${gid}/feedback/${feedbackId}`,
                'DELETE',
                undefined,
                {
                    colName: colId,
                    uid: getMyUid()
                }, {withUpdate: true})
        }catch(err){
            console.error(err);
        }
    },[colId,gid,sendRequest])

    const onFeedbackVote = useCallback(async(feedbackId, reaction) => {
        try{
            await sendRequest(
                `${process.env.REACT_APP_BACKEND_URL}/api/grid/${gid}/feedback/${feedbackId}`,
                'PATCH',
                undefined,
                {
                    colName: colId,
                    uid: getMyUid(),
                    reaction
                }, {withUpdate: true})
        }catch(err){
            console.error(err);
        }
    },[colId,gid,sendRequest])


    const buildFeedbacks = () => {
        return feedbacks.sort((a,b) => calcSumOfReactions(b.reactions) - calcSumOfReactions(a.reactions))
                        .map(item =>
                            <Feedback   value={item.value}
                                        key={item.feedbackId}
                                        onDelete={() => deleteFeedbackById(item.feedbackId)}
                                        onUpdate={(value) => onFeedbackVote(item.feedbackId, value)}
                                        votes={item.votes}
                                        createdBy={item.createdBy}
                                        reactions={item.reactions}
                                        opacityOnHightlight={highlightMode && calcSumOfReactions(item.reactions) === 0}/>
        )
    }
    
    return <React.Fragment>
        <div className={`col ${highlightMode ? 'hightlight' : ''}`} style={style}>
            <div className="top">
                <img src={`${iconPath}${icon}.png`} alt="" className="icon"/>
                <div className="title">{title}</div>
            </div>
            <div className="body" ref={bodyRef}>
                {buildFeedbacks()}
            </div>
            <div className="footer">
                <AddInput className="add-input" onNew={handleNewFeedback}/>
            </div>
        </div>
        <ErrorSnack error={error}/>
    </React.Fragment> 
    
};



export default Col;