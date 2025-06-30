const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const basePath = path.join(__dirname, 'userfiles');
const samplesPath = path.join(__dirname, 'samples');

// Hilfsfunktion zur sicheren ID-Verwendung
function sanitizeId(id) {
    return String(id).replace(/[^a-z0-9]/gi, '');
}

router.get('/file/:id', (req, res) => {
    const userId = req.user.sub;
    const fileId = sanitizeId(req.params.id);
    const filename = `${userId}-${fileId}.txt`;
    const userDir = path.join(basePath, userId);
    const filePath = path.join(userDir, filename);

    // Wenn Datei nicht existiert: von Sample kopieren
    if (!fs.existsSync(filePath)) {
        const sampleFile = path.join(samplesPath, `${fileId}.txt`);
        if (!fs.existsSync(sampleFile)) {
            return res.status(404).json({ error: `Sample ${fileId}.txt not found` });
        }

        if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });
        fs.copyFileSync(sampleFile, filePath);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ content });
});

router.post('/file/:id', (req, res) => {
    const userId = req.user.sub;
    const fileId = sanitizeId(req.params.id);
    const content = req.body.content;

    const userDir = path.join(basePath, userId);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    const filename = `${userId}-${fileId}.txt`;
    const filePath = path.join(userDir, filename);

    fs.writeFileSync(filePath, content);
    res.json({ success: true });
});

module.exports = router;
