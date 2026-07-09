import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;

        let title = null;
        let chat = null;
        let resolvedChatId = chatId;

        if (!resolvedChatId) {
            title = await generateChatTitle(message);
            chat = await chatModel.create({
                user: req.user.id,
                title,
            });
            resolvedChatId = chat._id;
        }

        await messageModel.create({
            chat: resolvedChatId,
            content: message,
            role: "user",
        });

        const messages = await messageModel.find({ chat: resolvedChatId }).sort({ createdAt: 1 });
        const result = await generateResponse(messages);

        const aiMessage = await messageModel.create({
            chat: resolvedChatId,
            content: result.content,
            role: "ai",
        });

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: {
                title,
                chat,
                chatId: resolvedChatId,
                aiMessage,
                sources: result.sources ?? [],
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export async function getChats(req, res) {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 20, 1);
        const skip = (page - 1) * limit;

        const [ chats, total ] = await Promise.all([
            chatModel.find({ user: req.user.id }).sort({ updatedAt: -1 }).skip(skip).limit(limit),
            chatModel.countDocuments({ user: req.user.id }),
        ]);

        return res.status(200).json({
            success: true,
            message: "Chats retrieved successfully",
            data: {
                chats,
                total,
                page,
                hasMore: skip + chats.length < total,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export async function getMessages(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOne({
            _id: chatId,
            user: req.user.id,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            data: { messages },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

export async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;

        const chat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: req.user.id,
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        await messageModel.deleteMany({ chat: chatId });

        return res.status(200).json({
            success: true,
            message: "Chat deleted successfully",
            data: { chatId },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
