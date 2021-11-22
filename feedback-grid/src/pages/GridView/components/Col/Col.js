import React,{useRef} from "react";
import AddInput from "../AddInput/AddInput";
import Card from "../Feedback/Feedback";
import './Col.css'
import {getMyUid} from "../../../../helpers/uid";
const iconPath = process.env.PUBLIC_URL + '/assets/icons/';

const Col = ({title, icon, onUpdate,feedbacks = []}) => {
    const bodyRef = useRef(null);

    const handleNewItem = (value) => {
        if(value === '') return;
        const createdItem = {
            value,
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

    const handleReactions = (reaction,index) => {
        const newItems = [...feedbacks];
        newItems[index].reactions[reaction] = newItems[index].reactions[reaction] + 1;
        onUpdate(newItems);
    }

    const handleDelete = (index) => {
        const newItems = [...feedbacks];
        newItems.splice(index,1);
        onUpdate(newItems);
    }
    
    return <div className="col">
        <div className="top">
            <img src={`${iconPath}${icon}.png`} alt="" className="icon"/>
            <div className="title">{title}</div>
        </div>
        <div className="body" ref={bodyRef}>
            {feedbacks.map((item, index) => <Card   value={item.value}
                                                key={index}
                                                onDelete={() => handleDelete(index)}
                                                createdBy={item.createBy}
                                                reactions={item.reactions}
                                                onReaction={(value) => handleReactions(value,index)}/>)}
        </div>
        <div className="footer">
            <AddInput className="add-input" onNew={handleNewItem}/>
        </div>
    </div>
};

export default Col;