import React,{useRef, useCallback} from "react";
import { useParams } from "react-router";
import Col from "../Col/Col";
import './Grid.css'
import useGrid from "../../../../hooks/grid-hook";
import { ErrorSnack } from "../../../../shared/components";


const ColsData = [
    {
        title: "Things I Loves",
        icon: "heart",
        id: "things_love",
    },
    {
        title: "Things I dislike",
        icon: "dislike",
        id: "things_dislike",
    },
    {
        title: "Things I wants to improves",
        icon: "improve",
        id: "things_improve",
    },
    {
        title: "New things I have",
        icon: "innovation",
        id: "things_new",
    },
]

const DELTEA = window.innerWidth / 2;

const Grid = () => {
    const { gid } = useParams();
    const gridRef = useRef(null);
    const {isLoading, findCol, onColUpdate,errorMessage} = useGrid(gid);
    
    const handleEndTouch = useCallback(event => {
        const { scrollLeft } = gridRef.current;
        const currentOffset = scrollLeft % window.innerWidth;
        const currentCol = Math.floor(scrollLeft / window.innerWidth);

        if(currentOffset > DELTEA){
            gridRef.current.scrollTo({
                left: (currentCol + 1) * window.innerWidth,
                behavior: 'smooth'
            });
        } else {
            gridRef.current.scrollTo({
                left: currentCol * window.innerWidth,
                behavior: 'smooth'
            });
        }

    },[])
    React.useEffect(() => {
        gridRef.current.addEventListener("touchend", handleEndTouch)
        gridRef.current.scrollLeft = 0;
    },[handleEndTouch])

    return <React.Fragment>
        <div className="grid" ref={gridRef}>
        {isLoading ?    <div className="loader"></div> :
                            ColsData.map(col => <Col    key={col.id}
                                                        title={col.title}
                                                        icon={col.icon}
                                                        onUpdate={(feedbacks) => onColUpdate(col.id,feedbacks)}
                                                        feedbacks={findCol(col.id)}/>)}
        </div>
        <ErrorSnack error={errorMessage}/>
        </React.Fragment>
};

export default Grid;