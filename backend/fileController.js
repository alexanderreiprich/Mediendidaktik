const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const basePath = path.join(__dirname, 'userfiles');
const tasksPath = path.join(__dirname, 'tasks');

// Hilfsfunktion zur sicheren ID-Verwendung
function sanitizeId(id) {
    return String(id).replace(/[^a-z0-9]/gi, '');
}

router.get('/task/:id/begin', (req, res) => {
    const fileId = sanitizeId(req.params.id);

    const taskFile = path.join(tasksPath, `${fileId}.json`);
    if (!fs.existsSync(taskFile)) {
        return res.status(404).json({ error: `Task ${fileId}.json not found` });
    }

    const content = JSON.parse(fs.readFileSync(taskFile, 'utf-8'));
    res.json(content);
});

router.get('/task/:id', (req, res) => {
    const userId = req.user.sub;
    const fileId = sanitizeId(req.params.id);
    const filename = `${userId}-${fileId}.json`;
    const userDir = path.join(basePath, userId);
    const filePath = path.join(userDir, filename);

    // Wenn Datei (user-spezifisch) nicht existiert: 204 No Content
    if (!fs.existsSync(filePath)) {
        // Check, ob Aufgabe überhaupt existiert
        const taskFile = path.join(tasksPath, `${fileId}.json`);
        if (!fs.existsSync(taskFile)) {
            return res.status(404).json({ error: `Task ${fileId}.json not found` });
        }

        return res.status(204).json({});
    }

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(content);
});

router.post('/task/:id', (req, res) => {
    const userId = req.user.sub;
    const fileId = sanitizeId(req.params.id);
    const { html, css, js } = req.body;

    const userDir = path.join(basePath, userId);
    if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

    const filename = `${userId}-${fileId}.json`;
    const filePath = path.join(userDir, filename);

    const payload = { html, css, js };

    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
    res.json({ success: true });
});

module.exports = router;
