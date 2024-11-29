const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

exports.createConversation = async (req, res) => {
  try {
    const { userId, participantId } = req.body;

    // Validate IDs
    if (!userId || !participantId) {
      return res
        .status(400)
        .json({ message: "Invalid user or participant ID." });
    }

    // Check if the conversation already exists
    const existConversation = await Conversation.findOne({
      $or: [
        { participant: userId, creator: participantId },
        { participant: participantId, creator: userId },
      ],
    });

    if (existConversation) {
      return res.status(200).json({
        message: "Conversation already exists",
        conversationId: existConversation._id,
      });
    }

    // Create new conversation
    const newConversation = new Conversation({
      participant: participantId,
      creator: userId,
    });

    const savedConversation = await newConversation.save();
    return res.status(200).json({
      message: "New conversation created successfully",
      conversationId: savedConversation._id,
    });
  } catch (error) {
    console.error("Error creating conversation:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch all conversations where the user is a participant or the creator
    const conversations = await Conversation.find({
      $or: [{ participant: userId }, { creator: userId }],
    })
      .populate("participant", "name avater username") // Populate participant details
      .populate("creator", "name avater username"); // Populate creator details

    // For each conversation, find the last message
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await Message.findOne({
          conversation_id: conversation._id,
        }).sort({ createdAt: -1 });

        return {
          ...conversation.toObject(),
          lastMessage, // Attach the last message to each conversation
        };
      })
    );

    return res.status(200).json(conversationsWithLastMessage);
  } catch (error) {
    console.error("Error fetching conversations:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.showConversation = async (req, res) => {
  const conversationId = req.params.conversationId;

  const messages = await Message.find({
    conversation_id: conversationId,
  }).sort("createdAt-1");

  const conversation = await Conversation.findById(conversationId)
    .populate("participant", "name avater username")
    .populate("creator", "name avater username")
    .exec();
  return res.status(200).json({ conversation, messages });
};
