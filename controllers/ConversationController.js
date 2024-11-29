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
    const conversations = await Conversation.find({
      $or: [{ participant: userId }, { creator: userId }],
    })
      .populate("participant", "name avater username") // Populate participant details
      .populate("creator", "name avater username"); // Populate creator details
    console.log(conversations);
    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Error creating conversation:", error.message);
    return res.status(500).json({ message: "Internal server error." });
  }
};

exports.showConversation = async (req, res) => {
  // get conversationId form params
  // find conversation in conversation list
  // populate user modal with name, avater, username
  // populate messages modal with all messages
  // populate participants modal with all participants
  // return the conversation data
  // implement socket for real-time conversation

  // Example:
  const conversationId = req.params.conversationId;

  const messages = await Message.find({
    conversation_id: conversationId,
  }).sort("-createdAt");

  const conversation = await Conversation.findById(conversationId)
    .populate("participant", "name avater username")
    .populate("creator", "name avater username")
    .exec();
  return res.status(200).json({ conversation, messages });
  // Implement socket for real-time conversation
  // Example:
  // socket.on("join-conversation", (data) => {
  //    socket.join(data.conversationId);
  //    console.log(`User ${data.userId} joined conversation ${data.conversationId}`);
  // });
  // socket.on("send-message", (data) => {
  //    const newMessage = new Message({
  //       content: data.content,
  //       sender: data.userId,
  //       conversation: data.conversationId,
  //    });
  //    newMessage.save();
  //    io.to(data.conversationId).emit("new-message", newMessage);
  // });
  // socket.on("disconnect", () => {
  //    console.log("User disconnected");
  // });
};
