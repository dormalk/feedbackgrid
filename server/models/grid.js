const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const HttpError = require('../models/http-errors');
const { Mutex } = require('async-mutex'); 
const RELEASE_TIMEOUT = process.env.RELEASE_TIMEOUT || 3000;
const util = require('util');


log = message => { 
    console.log(util.inspect(message, false, null, true /* enable colors */))
}

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
        this._lockes = {};
    }

    _

    _initCol = (colName) => {
        return {
            name: colName,
            feedbacks: []
        }
    }

    getGridById = async (gridId) => {
        if(!this._lockes[gridId]){
            console.log('getGridById | create Mutex')
            this._lockes[gridId] = new Mutex()
        }
        console.log('Start Get Grid')
        const release = await this._lockes[gridId].acquire();
        if(RELEASE_TIMEOUT != 0) setTimeout(() => release(), RELEASE_TIMEOUT)

        let grid = this.grids.find(grid => grid.gridId === gridId);
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
        let gridDB;
        try{
            gridDB = await Grid.findOne({gridId})
        }catch(err){
            release();
            const error = new HttpError('Could not find grid', 500);
            throw error; 
        }

        if(!gridDB) {
            try{
                gridDB = new Grid(grid);
                await gridDB.save()
            }catch(err){
                console.error(err)
                const error = new HttpError('Could not create grid', 500);
                throw error;
            }
            finally{
                release();
            }
     
        }else release();
        console.log('End Get Grid')

        return gridDB.toObject({getters: true});
    }

    updateGridById = async (gridId,gridData,uid) => {
        //start update
        console.log('Start Update');
        if(!this._lockes[gridId]){
            console.log('updateGridById | create Mutex')
            this._lockes[gridId] = new Mutex()
        }

        const release = await this._lockes[gridId].acquire();
        if(RELEASE_TIMEOUT != 0) setTimeout(() => release(), RELEASE_TIMEOUT)

        let currGrid;
        let currGridIndex = this.grids.findIndex(grid => grid.gridId === gridId);
        if(currGridIndex === -1) {
            try{
                const tempGrid = await Grid.findOne({gridId})
                currGrid = tempGrid.toObject({getters: true});
                this.grids.push(currGrid);
                currGridIndex = this.grids.length - 1;
            }catch(err){
                release();
                const error = new HttpError('Could not find grid', 500);
                throw error; 
            }
        } else {
            currGrid = this.grids[currGridIndex];
        }

        console.log('Before Update Grid')
        log(gridData.cols);
        gridData.cols.forEach(col => {
            col.feedbacks.forEach(feedback => {
                //I need to revert all votes that not realted to uid
                const tempVotes = feedback.votes ? feedback.votes : {}; //the updated voteList
                const tempReactions = feedback.reactions; //the updated reactions
                // console.log('tempVotes',tempVotes)
                //get all feedbacks of current col state, and update the voteList
                const currFeedbacksArray = currGrid.cols.find(col => col.name === col.name).feedbacks;
                // console.log('currFeedbacks => ')
                // log(currFeedbacks)

                const currFeedback = currFeedbacksArray.find(currfeedback => currfeedback.cid === feedback.cid);
                if(currFeedback) {
                    feedback.votes = currFeedback.votes;
                    feedback.reactions = currFeedback.reactions;
                }
                //update the feedback if there is any change
                if(!feedback.votes) feedback.votes = {};
                if(tempVotes[uid] && tempVotes[uid] != feedback.votes[uid]) {
                    //decrease the old reaction
                    if(feedback.votes[uid]) {
                        feedback.reactions[feedback.votes[uid]] = currFeedback.reactions[feedback.votes[uid]] - 1;
                    }
                    //update the new vote
                    feedback.votes[uid] = tempVotes[uid];
                    //increase the new reaction
                    feedback.reactions[tempVotes[uid]] = currFeedback.reactions[tempVotes[uid]] + 1;
                }
            })
        });
        this.grids[currGridIndex].cols = gridData.cols;
        console.log('After Update Grid')
        log(gridData.cols)
        try{
            await Grid.findOneAndUpdate({gridId}, gridData, {new: false, safe: true, useFindAndModify: false});
        }catch(err){
            console.log(err);
            const error = new HttpError('Could not update grid', 500);
            throw error;
        } finally {
            release();
        }
        console.log('Finish update');
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