const { application } = require('express');
const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce_controller');
const auth = require('../middleware/auth');
const multer = require('../middleware/mutler-config')

router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;
