const express = require("express");
const _birthController = require("../controllers/Stillbirthcertificate");
const multer = require('multer');
const { upload } = require('../helpers/uploader');
// const path = require('path');
const router = new express.Router();

router.get("/", async (req, res) => {
    res.send("Hello Nites");
    console.log('test')
});

router.post("/create", _stillbirthController.store);
router.post("/update", _stillbirthController.update);
router.get('/getAll', _stillbirthController.index);
router.post('/import', upload('file'), _stillbirthController.importData);
router.get('/validate/', _stillbirthController.show);

module.exports = router;
