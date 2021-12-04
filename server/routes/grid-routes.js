const express = require('express');
const {
    findGridById,
    createNewGrid,
    createNewFeedback,
    deleteFeedbackById,
    updateFeedbackVote,
    deleteGridById
} = require('../controllers/grid-controller');


const router = express.Router();

router.get('/:gid', findGridById)
router.post('/:gid', createNewGrid)
router.delete('/:gid', deleteGridById)
router.post('/:gid/feedback', createNewFeedback)
router.delete('/:gid/feedback/:fid', deleteFeedbackById)
router.patch('/:gid/feedback/:fid', updateFeedbackVote)

module.exports = router;