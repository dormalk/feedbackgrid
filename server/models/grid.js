const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const HttpError = require('../models/http-errors');

const gridSchema = new Schema({
    gridId: {type: String, required: true, unique: true},
    cols: [{
        name: { type: String, required: true },
        feedbacks: [{
            cid: { type: String, required: true, unique: false },
            value: { type: String, required: true },
            createBy: { type: String, required: true },
            reactions: {
                loves: { type: Number, default: 0 },
                celebrates: { type: Number, default: 0 },
                dislikes: { type: Number, default: 0 },
                evils: { type: Number, default: 0 },
            },
            votes: { type: Schema.Types.Mixed, default: {} },
        }]
    }]
}, {
    timestamps: {
        createdAt: 'created_at',
    }
});



const Grid = mongoose.model('Grid', gridSchema);

class GridManager {
    constructor(){
        this.grids = [];
    }

    _initCol = (colName) => {
        return {
            name: colName,
            feedbacks: []
        }
    }

    getGridById = (gridId) => {
        let grid = this.grids.find(grid => {
            return grid.gridId === gridId;
        });
        if(!grid) {
            grid = {
                gridId: gridId,
                cols: [
                    this._initCol('things_love'),
                    this._initCol('things_dislike'),
                    this._initCol('things_improve'),
                    this._initCol('things_new'),
                ]
            }
            this.grids.push(grid);
        }


        Grid.findOne({gridId})
        .then(gridDB => {
            if(!gridDB) {
                const newGrid = new Grid(grid);
                newGrid.save()
                .then(() => {})
                .catch(err => {
                    console.error(err)
                    const error = new HttpError('Could not create grid', 500);
                    throw error;
                });
            }
        })
        .catch(err => {
            const error = new HttpError('Could not find grid', 500);
            throw error; 
        })
        return grid;
    }

    updateGridById = (gridId,gridData) => {
        let gridIndex = this.grids.findIndex(grid => grid.gridId === gridId);
        if(gridIndex === -1) {
            const error = new HttpError('Could not update grid', 500);
            throw error;
        }
        this.grids[gridIndex] = {
            ...this.grids[gridIndex],
            cols: [...gridData.cols]
        };
        Grid.findOneAndUpdate({gridId}, gridData, {new: false})
        .catch(err => {
            console.log(err);
            const error = new HttpError('Could not update grid', 500);
            throw error;
        })
        return gridData;

    } 

    removeGridById = (gridId) => {
        let gridIndex = this.grids.findIndex(grid => grid.gridId === gridId);
        if(gridIndex === -1) {
            const error = new HttpError('Could not remove grid', 500);
            throw error;
        }

        this.grids.splice(gridIndex, 1);
        Grid.findOneAndRemove({gridId})
        .catch(err => {
            const error = new HttpError('Could not remove grid', 500);
            throw error;
        })
        return;
    }

    checkIfGridExists = async(gridId) => {
        let grid;
        try{
            grid = await Grid.findOne({gridId});
        }catch(err){
            console.error(err)
            const error = new HttpError('Could not find grid', 500);
            throw error;
        }
        if(!grid){
            console.error(err)
            const error = new HttpError('Could not find grid', 404);
            throw error;
        }

        return grid;
    }
} 

module.exports = new GridManager();