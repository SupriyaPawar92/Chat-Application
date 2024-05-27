const Image = require('../models/Image');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage }).single('image');

exports.uploadImage = (req, res) => {
    upload((req, res, err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const newImage = new Image({ imagePath: req.file.path });
        console.log('new==============', newImage);
        newImage.save()
            .then(() => res.status(201).json({ message: 'Image uploaded successfully', path: req.file.path }))
            .catch((error) => res.status(400).json({ error: error.message }));
    });
};