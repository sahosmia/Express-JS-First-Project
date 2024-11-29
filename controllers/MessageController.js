const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { text, receiver, sender, conversation_id } = req.body;

    // Validate IDs
    if (!text || !receiver || !sender || !conversation_id) {
      return res
        .status(400)
        .json({ message: "Invalid user or participant ID." });
    }

    // Create new conversation
    const newMessage = new Message({
      text,
      receiver,
      sender,
      conversation_id,
    });

    await Conversation.findByIdAndUpdate(
      conversation_id,
      { last_updated: Date.now() }, // Update the timestamp
      { new: true } // Return the updated document
    );

    const savedConversation = await newMessage.save();
    return res.status(200).json({
      message: "New message send successfully",
    });
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
  const conversation = await Message.findById(conversationId)
    .populate("participant", "name avater username")
    .populate("creator", "name avater username")
    .exec();
  return res.status(200).json(conversation);
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
