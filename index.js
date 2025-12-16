const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let onlineUsers = {};

app.post("/ping", (req, res) => {
    const { userId, username, placeId } = req.body;

    if (!userId || !username) {
        return res.status(400).json({ error: "Invalid data" });
    }

    onlineUsers[userId] = {
        username,
        placeId,
        lastSeen: Date.now()
    };

    const now = Date.now();
    for (const id in onlineUsers) {
        if (now - onlineUsers[id].lastSeen > 30000) {
            delete onlineUsers[id];
        }
    }

    const others = Object.entries(onlineUsers)
        .filter(([id]) => id != userId)
        .map(([_, data]) => ({
            username: data.username
        }));

    res.json({ others });
});

app.listen(3000, () => {
    console.log("Backend running");
});