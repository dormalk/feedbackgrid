const express = require('express');
const {
    getGridById,
    setGridById,
    deleteGridById,
    checkGridExists
} = require('../controllers/grid-controller');


const router = express.Router();

router.get('/:gid', getGridById)
router.get('/check/:gid',checkGridExists)
router.post('/:gid', setGridById)
router.delete('/:gid', deleteGridById)


module.exports = router;