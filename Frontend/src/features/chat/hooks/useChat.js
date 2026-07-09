import { useDispatch } from "react-redux";
import {
    addNewMessage,
    clearError,
    createNewChat,
    deleteChat as deleteChatAction,
    replaceChat,
    setChats,
    setCurrentChatId,
    setError,
    setLoading,
    setMessages,
    setTyping,
} from "../chat.slice";
import { deleteChat, getChats, getMessages, sendMessage } from "../service/chat.api";

const mapMessage = (message) => ({
    id: message._id || crypto.randomUUID(),
    content: message.content,
    role: message.role,
    createdAt: message.createdAt || new Date().toISOString(),
    sources: message.sources || [],
});

export const useChat = () => {
    const dispatch = useDispatch();

    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(clearError());
            dispatch(setTyping(true));

            const optimisticChatId = chatId || crypto.randomUUID();

            if (!chatId) {
                dispatch(createNewChat({
                    chatId: optimisticChatId,
                    title: "New Chat",
                }));
                dispatch(setCurrentChatId(optimisticChatId));
            }

            dispatch(addNewMessage({
                chatId: chatId || optimisticChatId,
                message: {
                    id: crypto.randomUUID(),
                    content: message,
                    role: "user",
                    createdAt: new Date().toISOString(),
                    sources: [],
                },
            }));

            const data = await sendMessage({ message, chatId });
            const { chat, chatId: resolvedChatId, aiMessage, sources } = data.data;
            const effectiveChatId = chatId || resolvedChatId;

            if (!chatId && chat) {
                dispatch(replaceChat({
                    oldChatId: optimisticChatId,
                    newChat: chat,
                }));
            }

            dispatch(addNewMessage({
                chatId: effectiveChatId,
                message: {
                    ...mapMessage(aiMessage),
                    sources: sources || [],
                },
            }));
            dispatch(setCurrentChatId(effectiveChatId));
            return effectiveChatId;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to send message"));
            throw error;
        } finally {
            dispatch(setTyping(false));
        }
    }

    async function handleGetChats({ page = 1, append = false } = {}) {
        try {
            dispatch(clearError());
            dispatch(setLoading(true));
            const data = await getChats({ page, limit: 20 });
            dispatch(setChats({
                chats: data.data.chats,
                page: data.data.page,
                total: data.data.total,
                hasMore: data.data.hasMore,
                append,
            }));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch chats"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleOpenChat(chatId, chats) {
        try {
            dispatch(clearError());
            if (!chats[ chatId ]?.messages.length) {
                const data = await getMessages(chatId);
                dispatch(setMessages({
                    chatId,
                    messages: data.data.messages.map(mapMessage),
                }));
            }
            dispatch(setCurrentChatId(chatId));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to open chat"));
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            dispatch(clearError());
            await deleteChat(chatId);
            dispatch(deleteChatAction(chatId));
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to delete chat"));
        }
    }

    function handleNewChat() {
        dispatch(setCurrentChatId(null));
    }

    return {
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat,
        handleNewChat,
    };
};
