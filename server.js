const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

// Middleware to log requests and responses
app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);

    const originalSend = res.send;
    res.send = function (body) {
        console.log(`Response: ${res.statusCode} ${body}`);
        originalSend.call(this, body);
    };

    next();
});

// Corrected sanitizePath function
function sanitizePath(input) {
    return path.normalize(input).replace(/^\.\//, "").replace(/\//g, path.sep);
}

// Sanitize and validate folder and episode parameters
function isValidPath(base, target) {
    const resolvedBase = path.resolve(base);
    const resolvedTarget = path.resolve(base, target);
    return resolvedTarget.startsWith(resolvedBase);
}

// Route to serve the index.html file
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// Updated route to fetch episodes in a specific folder
app.get("/content/:folder/episodes", function (req, res) {
    const folder = sanitizePath(decodeURIComponent(req.params.folder));
    const contentDir = path.join(__dirname, "content", folder);

    if (!isValidPath(path.join(__dirname, "content"), contentDir) || !fs.existsSync(contentDir)) {
        console.error("Invalid or non-existent folder:", contentDir);
        return res.status(404).send("Folder not found");
    }

    const episodes = fs.readdirSync(contentDir, { withFileTypes: true })
        .filter((dirent) => dirent.isFile() && dirent.name.match(/^[0-9]+\.mp4$/))
        .map((dirent) => dirent.name);

    console.log("Episodes found:", episodes);
    res.json(episodes);
});

// Updated route to fetch a specific episode
app.get("/content/:folder/:episode", function (req, res) {
    const folder = sanitizePath(req.params.folder);
    const episode = sanitizePath(req.params.episode);
    const videoPath = path.join(__dirname, "content", folder, episode);

    if (!isValidPath(path.join(__dirname, "content"), videoPath) || !fs.existsSync(videoPath)) {
        console.error("Invalid or non-existent file:", videoPath);
        return res.status(404).send("File not found");
    }

    const fileExtension = path.extname(videoPath);

    // Only handle video files with .mp4 extension for streaming
    if (fileExtension === ".mp4") {
        const videoSize = fs.statSync(videoPath).size;
        const range = req.headers.range;
        if (!range) {
            return res.status(400).send("Requires Range header");
        }

        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };

        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);
    } else {
        res.sendFile(videoPath);
    }
});

// Route to fetch content metadata
app.get("/content", function (req, res) {
    const contentDir = path.join(__dirname, "content");
    const folders = fs.readdirSync(contentDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

    const metadata = folders.map((folder) => {
        const coverPath = path.join(contentDir, folder, "cover.webp");
        const coverExists = fs.existsSync(coverPath);
        return {
            title: folder,
            cover: coverExists ? `/content/${folder}/cover.webp` : null,
        };
    });

    // log the metadata to the console

    res.json(metadata);
});

app.get("/content/:folder", function (req, res) {
    const folder = req.params.folder;
    const contentDir = path.join(__dirname, "content", folder);

    if (!fs.existsSync(contentDir)) {
        return res.status(404).send("Folder not found");
    }

    res.sendFile(path.join(__dirname, "index.html"));
});

// Static file middleware for the root directory
app.use(express.static(__dirname));

// Static file middleware
//app.use("/content", express.static(path.join(__dirname, "content")));

app.listen(8000, function () {
    console.log("Listening on port 8000!");
});