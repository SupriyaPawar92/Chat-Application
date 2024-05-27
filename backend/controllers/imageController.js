const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const Image = require('../models/image');

const router = express.Router();

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Check file type
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
};

// Initialize upload
const upload = multer({
    storage,
    limits: { fileSize: 2000000 }, // Limit size to 2MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

// Upload route
router.post('/upload', protect, upload.single('image'), async (req, res) => {
    if (req.file) {
        const newImage = new Image({
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
            size: req.file.size,
            mimetype: req.file.mimetype,
            user: req.user.id,
        });

        try {
            const savedImage = await newImage.save();
            res.json({
                success: true,
                message: 'Image uploaded successfully!',
                image: savedImage,
            });
        } catch (error) {
            console.error('Error saving image metadata', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    } else {
        res.status(400).json({ success: false, message: 'Failed to upload image' });
    }
});

module.exports = router;