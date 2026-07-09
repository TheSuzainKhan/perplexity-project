import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        isTyping: false,
        error: null,
        pagination: {
            page: 1,
            total: 0,
            hasMore: false,
        },
    },
    reducers: {
        setChats: (state, action) => {
            const { chats, page, total, hasMore, append = false } = action.payload;
            const nextChats = chats.reduce((acc, chat) => {
                acc[ chat._id ] = state.chats[ chat._id ] || {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                };

                acc[ chat._id ] = {
                    ...acc[ chat._id ],
                    title: chat.title,
                    lastUpdated: chat.updatedAt,
                };
                return acc;
            }, append ? { ...state.chats } : {});

            state.chats = nextChats;
            state.pagination = { page, total, hasMore };
        },
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[ chatId ] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            };
        },
        addNewMessage: (state, action) => {
            const { chatId, message } = action.payload;

            if (!state.chats[ chatId ]) {
                state.chats[ chatId ] = {
                    id: chatId,
                    title: "New Chat",
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                };
            }

            state.chats[ chatId ].messages.push(message);
            state.chats[ chatId ].lastUpdated = message.createdAt || new Date().toISOString();
        },
        replaceChat: (state, action) => {
            const { oldChatId, newChat } = action.payload;
            const existingChat = state.chats[ oldChatId ];

            state.chats[ newChat._id ] = {
                id: newChat._id,
                title: newChat.title,
                messages: existingChat?.messages || [],
                lastUpdated: newChat.updatedAt || existingChat?.lastUpdated || new Date().toISOString(),
            };

            delete state.chats[ oldChatId ];

            if (state.currentChatId === oldChatId) {
                state.currentChatId = newChat._id;
            }
        },
        setMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (!state.chats[ chatId ]) {
                return;
            }
            state.chats[ chatId ].messages = messages;
        },
        deleteChat: (state, action) => {
            delete state.chats[ action.payload ];
            if (state.currentChatId === action.payload) {
                state.currentChatId = null;
            }
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setTyping: (state, action) => {
            state.isTyping = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    setChats,
    createNewChat,
    addNewMessage,
    replaceChat,
    setMessages,
    deleteChat,
    setCurrentChatId,
    setLoading,
    setTyping,
    setError,
    clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
