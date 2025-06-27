const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const basePath = path.join(__dirname, 'userfiles');

router.get('/file', (req, res) => {
    const userId = req.user.sub;
    const filePath = path.join(basePath, userId, 'data.txt');
    if (!fs.existsSync(filePath)) return res.json({ content: "" });

    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ content });
});

router.post('/file', (req, res) => {
    const userId = req.user.sub;
    const content = req.body.content;

    const userDir = path.join(basePath, userId);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    const filePath = path.join(userDir, 'data.txt');
    fs.writeFileSync(filePath, content);
    res.json({ success: true });
});

module.exports = router;