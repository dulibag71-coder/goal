const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB 제한
});

// Routes
app.post('/api/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded' });
    }

    // 분석 작업 트리거 로직 (실제로는 MQ를 사용하겠으나, 여기서는 DB 레코드 생성 시뮬레이션)
    const videoData = {
        id: uuidv4(),
        filename: req.file.filename,
        url: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        status: 'PENDING',
        createdAt: new Date()
    };

    console.log('[*] Video uploaded:', videoData.filename);

    // 분석 워커에게 알리는 로직 (Job Queue) 등이 여기에 위치함

    res.json({
        message: 'Video uploaded successfully. Analysis starting...',
        video: videoData
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Export the app for Vercel Serverless Functions
module.exports = app;

// Start Server only if not running as a serverless function
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`[+] API Server running on http://localhost:${PORT}`);
        // Uploads 폴더가 없으면 생성
        const fs = require('fs');
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }
    });
}
