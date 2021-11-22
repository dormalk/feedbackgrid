const HttpError = require('../models/http-errors');
const Grid = require('../models/grid');

const initCol = (colName) => {
    return {
        name: colName,
        feedbacks: []
    }
}

const checkGridExists = async (req, res, next) => {
    const gid = req.params.gid;
    let grid;
    try{
        grid = await Grid.findOne({gridId: gid});
    }catch(err){
        const error = new HttpError('Could not find grid', 500);
        return next(error);
    }
    if(!grid){
        const error = new HttpError('Could not find grid', 404);
        return next(error);
    }

    res.status(200).json({grid: grid.toObject({getters: true})});
};

const getGridById = async (req, res, next) => {

    const gid = req.params.gid;
    let grid;
    try{
        grid = await Grid.findOne({gridId: gid});
    }catch(err){
        const error = new HttpError('Could not find grid', 500);
        return next(error);
    }
    if(!grid){
        try{
            grid = new Grid({
                gridId: gid,
                cols: [
                    initCol('things_love'),
                    initCol('things_dislike'),
                    initCol('things_improve'),
                    initCol('things_new'),
                ]
            });
            await grid.save();
        }catch(err){
            const error = new HttpError('Could not create grid', 500);
            return next(error);
        }
    }

    res.status(200).json({grid: grid.toObject({getters: true})});


}

const setGridById = async (req, res, next) => {
    const gid = req.params.gid;
    const {grid} = req.body;
    let gridToUpdate;
    try{
        gridToUpdate = await Grid.findOne({gridId: gid});
    }catch(err){
        const error = new HttpError('Could not update grid', 500);
        return next(error);
    }

    if(!gridToUpdate){
        const error = new HttpError('Could not update grid', 404);
        return next(error);
    }

    gridToUpdate.cols = grid.cols;
    gridToUpdate.save();
    res.status(200).json({grid: gridToUpdate.toObject({getters: true})});
}

const deleteGridById = async (req, res, next) => {
    const gid = req.params.gid;
    let grid;
    try{
        grid = await await Grid.findOne({gridId: gid});
    }catch(err){
        const error = new HttpError('Could not delete grid', 500);
        return next(error);
    }
    if(!grid){
        const error = new HttpError('Could not delete grid', 404);
        return next(error);
    }
    res.status(200).json({message: 'Grid deleted'});
}

module.exports = {
    getGridById,
    setGridById,
    deleteGridById,
    checkGridExists
}