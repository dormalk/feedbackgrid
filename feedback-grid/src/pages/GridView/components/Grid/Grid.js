import React,{useRef, useCallback} from "react";
import Col from "../Col/Col";
import './Grid.css'
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

const Grid = ({isLoading, findCol, onColUpdate,errorMessage}) => {
    const gridRef = useRef(null);
    
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
                            ColsData.map((col,index) => <Col    key={col.id}
                                                                title={col.title}
                                                                icon={col.icon}
                                                                style={ index === 0 ? 
                                                                        styles.colFirst : 
                                                                        index === ColsData.length - 1 ? 
                                                                        styles.colLast : styles.col}
                                                                onUpdate={(feedbacks) => onColUpdate(col.id,feedbacks)}
                                                                feedbacks={findCol(col.id)}/>)}
        </div>
        <ErrorSnack error={errorMessage}/>
        </React.Fragment>
};

const styles = {
    col: window.innerWidth < 480 ? {
        backgroundRepeat: 'no-repeat, no-repeat',
        backgroundSize: '1.5rem, 1.5rem',
        backgroundPosition: 'center right 0.5rem ,center left 0.5rem',
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/icons/right-arrow.png), url(${process.env.PUBLIC_URL}/assets/icons/left-arrow.png)`,
    }:{},
    colFirst: window.innerWidth < 480 ? {
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5rem',
        backgroundPosition: 'center right 0.5rem ',
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/icons/right-arrow.png)`,
    }:{},
    colLast: window.innerWidth < 480 ?  {
        backgroundRepeat: 'no-repeat',
        backgroundSize: '1.5rem',
        backgroundPosition: 'center left 0.5rem',
        backgroundImage: `url(${process.env.PUBLIC_URL}/assets/icons/left-arrow.png)`,
    }:{}
}


export default Grid;