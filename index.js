const express = require("express");
const app = express();

app.use(express.json()); // REQUIRED

const onlineUsers = {}; // REQUIRED

app.post("/ping", (req, res) => {
    const { userId, username, placeId, jobId } = req.body;
    const now = Date.now();

    if (!userId || !username || !placeId || !jobId) {
        return res.status(400).json({ error: "Missing fields" });
    }

    // save / update user
    onlineUsers[userId] = {
        username,
        placeId,
        jobId,
        lastSeen: now
    };

    // remove inactive users (30s)
    for (const id in onlineUsers) {
        if (now - onlineUsers[id].lastSeen > 30000) {
            delete onlineUsers[id];
        }
    }

    // SAME SERVER ONLY
    const others = Object.entries(onlineUsers)
        .filter(([id, data]) =>
            id !== String(userId) &&
            data.placeId === placeId &&
            data.jobId === jobId
        )
        .map(([_, data]) => ({
            username: data.username
        }));

    res.json({ others });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Backend running");
});