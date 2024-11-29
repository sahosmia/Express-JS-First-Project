const express = require("express");

const {
  createConversation,
  showConversation,
  getConversations,
} = require("../../controllers/ConversationController");

const router = express.Router();

// Authentication Routes
router.post("/", createConversation);
router.get("/:conversationId", showConversation);
router.get("/user/:userId", getConversations);

module.exports = router;
