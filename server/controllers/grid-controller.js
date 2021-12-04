const Grid = require('../models/grid');
const HttpError = require('../models/http-errors');
const uuid = require('uuid').v4;
const util = require('util');

_initCol = (colName) => {
    return {
        name: colName,
        feedbacks: []
    }
}


const findGridById = async (req, res, next) => {
    const gid = req.params.gid;
    let grid;
    try{
        grid = await Grid.findOne({gridId: gid});    
    }catch(err){
        console.log(err)
        const error = new HttpError('Could not find grid', 500);
        return next(error);
    }
    if(!grid){
        const error = new HttpError('Could not find grid', 500);
        return next(error);
    }

    res.status(200).json({grid: grid.toObject({getters: true})});
}

const createNewGrid = async (req, res, next) => {
    const {gid} = req.params;
    let newGrid;
    try {
        newGrid = new Grid({
            gridId: gid,
            cols: [
                _initCol('things_love'),
                _initCol('things_dislike'),
                _initCol('things_improve'),
                _initCol('things_new'),
            ]
        })
        newGrid = await newGrid.save();
    }catch(err){
        const error = new HttpError('Could not create new grid', 500);
        return next(error);
    }
    res.status(200).json({grid: newGrid.toObject({getters: true})});
}

const createNewFeedback = async (req, res, next) => {
    const {gid} = req.params;
    const {colName,feedback,uid} = req.body;
    let grid;
    try{
        grid = await Grid.findOne({gridId: gid});
    }
    catch(err){
        const error = new HttpError('Could not find grid', 500);
        return next(error);
    }
    let col;
    col = grid.cols.find(col => col.name === colName);
    if(!col){
        const error = new HttpError('Could not find col', 500);
        return next(error);
    }
    const newFeedback = {
        feedbackId: uuid().slice(0,8),
        value: feedback,
        createdBy: uid,
        reactions: {
            loves: 0,
            celebrates: 0,
            dislikes: 0,
            evils: 0
        },
        votes: {}
    }
    col.feedbacks.push(newFeedback);
    try{
        grid = await grid.save();
    }catch(err){
        console.log(err)
        const error = new HttpError('Could not create new feedback', 500);
        return next(error);
    }
    res.status(200).json({grid: grid.toObject({getters: true})});
}

const deleteFeedbackById = async (req, res, next) => {
    const {gid,fid} = req.params;
    const {uid,colName} = req.body;
    console.log(uid,colName)
    let grid;
    try{
        grid = await Grid.findOne({gridId: gid});
    }
    catch(err){
        const error = new HttpError('Could not find grid', 500);
        return next(error);
    }
    let col;
    col = grid.cols.find(col => col.name === colName);
    if(!col){
        const error = new HttpError('Could not find col', 500);
        return next(error);
    }
    const feedbackIndex = col.feedbacks.findIndex(feedback => feedback.feedbackId === fid);
    if(feedbackIndex === -1){
        const error = new HttpError('Could not find feedback', 500);
        return next(error);
    }
    if(col.feedbacks[feedbackIndex].createdBy !== uid){
        const error = new HttpError('You are not allowed to delete this feedback', 500);
        return next(error);
    }
    col.feedbacks.splice(feedbackIndex, 1);
    try{
        grid = await grid.save();
    }
    catch(err){
        const error = new HttpError('Could not delete feedback', 500);
        return next(error);
    }
    res.status(200).json({grid: grid.toObject({getters: true})});
}

const updateFeedbackVote = async (req, res, next) => {
    const {gid,fid} = req.params;
    const {uid, reaction, colName} = req.body;
    let grid;
    try{
        grid = await Grid.findOne({gridId: gid});
    }
    catch(err){
        const error = new HttpError('Could not find grid', 500);
        return next(error);
    }


    let col;
    col = grid.cols.find(col => col.name === colName);
    if(!col){
        const error = new HttpError('Could not find col', 500);
        return next(error);
    }
    let feedback;
    feedback = col.feedbacks.find(feedback => feedback.feedbackId === fid);
    if(!feedback){
        const error = new HttpError('Could not find feedback', 500);
        return next(error);
    }
    if(!feedback.votes[uid]){ // if user has not voted yet
        console.log('user has not voted yet')
        feedback.votes[uid] = reaction;
        feedback.reactions[reaction]++;
    } else if(feedback.votes[uid] !== reaction){ //if user has voted and changed his vote
        console.log('user has voted and changed his vote')
        feedback.reactions[feedback.votes[uid]]--;
        feedback.reactions[reaction]++;
        feedback.votes[uid] = reaction;
    } else if(feedback.votes[uid] === reaction){ //if user has voted and not changed his vote
        console.log('user has voted and not changed his vote')
        feedback.reactions[reaction]--;
        delete feedback.votes[uid];
    }
    col.feedbacks[col.feedbacks.indexOf(feedback)] = feedback;
    try{
        console.log(util.inspect(grid, false, null, true /* enable colors */))

        grid = await grid.save();
    }
    catch(err){
        const error = new HttpError('Could not update vote', 500);
        return next(error);
    }
    res.status(200).json({grid: grid.toObject({getters: true})});
}

const deleteGridById = async (req, res, next) => {
    const gid = req.params.gid;
    let grid;
    try{
        grid = await Grid.findOne({gridId: gid});
    }catch(err){
        const error = new HttpError('Could not find grid', 500);
        return next(error);
    }
    try{
        await grid.remove();
    }catch(err){
        const error = new HttpError('Could not delete grid', 500);
        return next(error);
    }
    res.status(200).json({message: 'Grid deleted'});
}

module.exports = {
    findGridById,
    createNewGrid,
    createNewFeedback,
    deleteFeedbackById,
    updateFeedbackVote,
    deleteGridById
}