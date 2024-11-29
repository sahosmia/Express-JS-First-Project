const express = require("express");

const { sendMessage } = require("../../controllers/MessageController");

const router = express.Router();

// Authentication Routes
router.post("/", sendMessage);
// router.get("/:conversationId", showConversation);

module.exports = router;
