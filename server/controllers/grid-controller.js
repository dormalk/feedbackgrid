const gridManager = require('../models/grid');


const checkGridExists = async(req, res, next) => {
    const gid = req.params.gid;
    let grid;
    try{
        grid = await gridManager.checkIfGridExists(gid)
    }catch(err){
        return next(err);
    }
    res.status(200).json({grid: grid.toObject({getters: true})});
};

const getGridById = async (req, res, next) => {
    const gid = req.params.gid;
    let grid;
    try{
        grid = await gridManager.getGridById(gid);
    }catch(err){
        console.log(err)
        return next(err);
    }

    res.status(200).json({grid});


}

const setGridById = async (req, res, next) => {
    const gid = req.params.gid;
    const {grid,uid} = req.body;
    let gridToUpdate;
    try{
        gridToUpdate = await gridManager.updateGridById(gid, grid, uid);
    }catch(err){
        console.log(err)
        return next(err);
    }

    res.status(200).json({grid: gridToUpdate});
}

const deleteGridById = async (req, res, next) => {
    const gid = req.params.gid;
    let grid;
    try{
        grid = gridManager.deleteGridById(gid);
    }catch(err){
        return next(err);
    }
    res.status(200).json({message: 'Grid deleted'});
}

module.exports = {
    getGridById,
    setGridById,
    deleteGridById,
    checkGridExists
}