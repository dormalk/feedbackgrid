const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gridSchema = new Schema({
    gridId: {type: String, required: true, unique: true},
    cols: [{
        name: { type: String, required: true, unique: false },
        feedbacks: [{
            feedbackId: { type: String, required: true, unique: false },
            value: { type: String, required: true },
            createdBy: { type: String, required: true },
            votes: { type: Schema.Types.Mixed, default: {} },
            reactions: {
                loves: { type: Number, default: 0 },
                celebrates: { type: Number, default: 0 },
                dislikes: { type: Number, default: 0 },
                evils: { type: Number, default: 0 },
            },
        }]
    }]
}, {
    timestamps: {
        createdAt: 'created_at',
    }
});

module.exports = mongoose.model('Grid', gridSchema);