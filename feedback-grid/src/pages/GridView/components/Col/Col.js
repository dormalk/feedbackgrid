import React,{useRef,useState} from "react";
import AddInput from "../AddInput/AddInput";
import Card from "../Feedback/Feedback";
import './Col.css'
import {getMyUid, generateUid} from "../../../../helpers/uid";
const iconPath = process.env.PUBLIC_URL + '/assets/icons/';


const HIGHTLIGHT_MODE_PRESENT_VALUE = 0.9;

const calcSumOfReactions = reactions => {
    let sum = 0;
    for(let key in reactions){
        sum += reactions[key];
    }
    return sum;
}

const Col = ({title, icon, onUpdate,feedbacks = [], style={}, userCounter}) => {
    const bodyRef = useRef(null);
    const [highlightMode,setHighlightMode] = useState(false);

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

    const handleNewItem = (value) => {
        if(value === '') return;
        const createdItem = {
            value,
            id: generateUid(),
            createBy: getMyUid(),
            reactions: {
                evils: 0,
                dislikes: 0,
                loves: 0,
                celebrates: 0,
            }
        }
        const updatedItems = feedbacks.concat(createdItem); 
        setTimeout(() => {
            bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
        })
        onUpdate(updatedItems);
    }

    const handleReactions = (reactions,id) => {
        const index = feedbacks.findIndex(item => item.id === id);
        const newItems = [...feedbacks];
        newItems[index].reactions = reactions;
        onUpdate(newItems);
    }

    const handleDelete = (id) => {
        const newItems = [...feedbacks];
        const index = newItems.findIndex(item => item.id === id);
        newItems.splice(index,1);
        onUpdate(newItems);
    }

    const buildFeedbacks = () => {
        return feedbacks.sort((a,b) => calcSumOfReactions(a.reactions) < calcSumOfReactions(b.reactions) ? 1 : -1)
                        .map((item,index) =>
                            <Card   value={item.value}
                                    key={item.id}
                                    onDelete={() => handleDelete(item.id)}
                                    createdBy={item.createBy}
                                    reactions={item.reactions}
                                    opacityOnHightlight={highlightMode && calcSumOfReactions(item.reactions) === 0}
                                    onReaction={(value) => handleReactions(value,item.id)}/>
        )
    }
    
    return <div className={`col ${highlightMode ? 'hightlight' : ''}`} style={style}>
        <div className="top">
            <img src={`${iconPath}${icon}.png`} alt="" className="icon"/>
            <div className="title">{title}</div>
        </div>
        <div className="body" ref={bodyRef}>
            {buildFeedbacks()}
        </div>
        <div className="footer">
            <AddInput className="add-input" onNew={handleNewItem}/>
        </div>
    </div>
};



export default Col;