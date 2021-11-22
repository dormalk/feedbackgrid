import React,{useState, useRef} from "react";
import './AddInput.css'
import { isRTL } from "../../../../helpers/text";

const iconPath = process.env.PUBLIC_URL + '/assets/icons/';

const AddInput = ({className, onNew}) => {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const [inputValue, setInputValue] = useState('');

    const handleClickPlus = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsOpen(true);
        inputRef.current.focus();
    }

    const handleSend = (event) => {
        event.preventDefault();
        event.stopPropagation();
        onNew(inputValue);
        setInputValue('')
    }

    const handleChangeInput = (event) => {
        setInputValue(event.target.value);
    }

    const onKeyUpHandler = (event) => {
        if(event.keyCode === 13) {
            handleSend(event);
        }
    }


    return <div className={`wrapper ${className}`}>
        <div className={`input-wrapper ${isOpen ? 'open' : ''}`}>
            <input  type="text" 
                    style={{direction: isRTL(inputValue) ? 'rtl' : 'ltr'}}
                    ref={inputRef}
                    placeholder="Add new item" 
                    value={inputValue}
                    onKeyUp={onKeyUpHandler}
                    onChange={handleChangeInput}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    className="c-input"/>
        </div>
        {
            isOpen ? 
            <img    src={`${iconPath}send.png`} 
                    alt="" 
                    onMouseDown={handleSend}
                    className="send-btn"/>:
            <img    src={`${iconPath}plus.png`} 
                    alt="" 
                    onMouseDown={handleClickPlus}
                    className="new-btn"/>
        }
    </div>
}

export default AddInput;