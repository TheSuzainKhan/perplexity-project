import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import remarkGfm from "remark-gfm";
import { useAuth } from "../../auth/hook/useAuth";
import { useChat } from "../hooks/useChat";

const suggestionChips = [
    "Latest news",
    "Explain quantum computing",
    "Plan a weekend trip",
    "Summarize AI regulations",
];

const formatTime = (value) => new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
});

const ArrowRightIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
    </svg>
);

const ArrowUpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
    </svg>
);

const MenuIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
    </svg>
);

const Dashboard = () => {
    const { handleLogout } = useAuth();
    const chat = useChat();

    const user = useSelector((state) => state.auth.user);
    const chats = useSelector((state) => state.chat.chats);
    const currentChatId = useSelector((state) => state.chat.currentChatId);
    const isTyping = useSelector((state) => state.chat.isTyping);
    const isLoading = useSelector((state) => state.chat.isLoading);
    const pagination = useSelector((state) => state.chat.pagination);

    const [ chatInput, setChatInput ] = useState("");
    const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        chat.handleGetChats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sortedChats = useMemo(
        () => Object.values(chats).sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)),
        [ chats ]
    );

    const currentChat = currentChatId ? chats[ currentChatId ] : null;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [ currentChat?.messages, isTyping ]);

    const handleSubmitMessage = async (event) => {
        event.preventDefault();

        const trimmedMessage = chatInput.trim();
        if (!trimmedMessage || isTyping) {
            return;
        }

        setChatInput("");
        try {
            await chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
        } catch {
            setChatInput(trimmedMessage);
        }
    };

    const handleSidebarScroll = async (event) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        const nearBottom = scrollHeight - scrollTop - clientHeight < 32;

        if (nearBottom && pagination.hasMore && !isLoading) {
            await chat.handleGetChats({ page: pagination.page + 1, append: true });
        }
    };

    return (
        <main className="min-h-screen bg-[#0d0d0d] text-white">
            <section className="flex min-h-screen flex-col md:h-screen md:flex-row">
                {isSidebarOpen ? (
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 z-30 bg-black/50 md:hidden"
                        aria-label="Close sidebar"
                    />
                ) : null}

                <aside className={`fixed inset-y-0 left-0 z-40 flex w-[min(82vw,320px)] flex-col border-r border-[#1b1b1b] bg-[#111111] p-4 transition-transform duration-200 md:static md:z-auto md:w-[260px] md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="mb-6 flex items-center gap-3">
                        <span className="h-3 w-3 rounded-full bg-[#20b2aa]" />
                        <h1 className="text-[22px] font-bold tracking-tight">Perplexity</h1>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            chat.handleNewChat();
                            setIsSidebarOpen(false);
                        }}
                        className="mb-6 flex w-full items-center gap-3 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-sm font-medium transition hover:bg-[#222222]"
                    >
                        <span className="text-lg leading-none">+</span>
                        New Thread
                    </button>

                    <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gray-400">
                        <span>Recent</span>
                        <div className="h-px flex-1 bg-[#2a2a2a]" />
                    </div>

                    <div onScroll={handleSidebarScroll} className="flex-1 space-y-1 overflow-y-auto pr-1">
                        {sortedChats.map((item) => (
                            <div key={item.id} className="group relative">
                                <button
                                    type="button"
                                    onClick={() => {
                                        chat.handleOpenChat(item.id, chats);
                                        setIsSidebarOpen(false);
                                    }}
                                    className={`w-full rounded-lg border-l-2 px-3 py-3 pr-10 text-left text-sm transition ${
                                        item.id === currentChatId
                                            ? "border-l-[#20b2aa] bg-[#1e1e1e] text-white"
                                            : "border-l-transparent text-[#c7c7c7] hover:bg-[#1a1a1a]"
                                    }`}
                                >
                                    <span className="block truncate">{item.title}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        chat.handleDeleteChat(item.id);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-1 text-[#7f7f7f] opacity-0 transition hover:bg-[#242424] hover:text-white group-hover:opacity-100"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#1f1f1f] bg-[#141414] p-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#20b2aa] text-sm font-semibold text-[#062725]">
                                {user?.username?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{user?.username}</p>
                                <p className="text-xs text-[#7c7c7c]">Signed in</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setIsSidebarOpen(false);
                                handleLogout();
                            }}
                            className="rounded-lg p-2 text-[#8a8a8a] transition hover:bg-[#1e1e1e] hover:text-white"
                            aria-label="Sign out"
                        >
                            <ArrowRightIcon />
                        </button>
                    </div>
                </aside>

                <section className="relative flex min-w-0 flex-1 flex-col">
                    <header className="border-b border-[#1b1b1b] px-4 py-4 md:px-6">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#151515] text-[#d7d7d7] md:hidden"
                                    aria-label="Open sidebar"
                                >
                                    <MenuIcon />
                                </button>
                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-medium text-[#d7d7d7]">
                                        {currentChat?.title || "New Thread"}
                                    </h2>
                                    <p className="text-xs text-[#6f6f6f] md:hidden">{user?.username || "Signed in"}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2a2a2a] bg-[#151515] text-[#d7d7d7] md:hidden"
                                aria-label="Sign out"
                            >
                                <ArrowRightIcon />
                            </button>
                        </div>
                    </header>

                    <div className="messages flex-1 overflow-y-auto px-4 py-5 md:px-8 md:py-6">
                        {!currentChatId ? (
                            <div className="flex min-h-full flex-col items-center justify-center py-10 text-center">
                                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">What do you want to know?</h2>
                                <p className="mt-3 max-w-xl text-sm text-[#8a8a8a] sm:text-base">Ask anything. Get answers with sources.</p>
                                <div className="mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3">
                                    {suggestionChips.map((chip) => (
                                        <button
                                            key={chip}
                                            type="button"
                                            onClick={() => setChatInput(chip)}
                                            className="rounded-full border border-[#2a2a2a] px-4 py-2 text-sm text-[#d4d4d4] transition hover:bg-[#1a1a1a]"
                                        >
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
                                {currentChat?.messages.map((message) => (
                                    <div key={message.id} className={message.role === "user" ? "ml-auto max-w-[92%] sm:max-w-[80%] md:max-w-[70%]" : "max-w-[95%] sm:max-w-[88%] md:max-w-[75%]"}>
                                        {message.role === "ai" ? (
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#123c39] text-xs text-[#7ce4dc]">
                                                    AI
                                                </div>
                                                <div>
                                                    <ReactMarkdown
                                                        remarkPlugins={[ remarkGfm ]}
                                                        components={{
                                                            p: ({ children }) => <p className="mb-3 text-sm leading-7 text-[#e4e4e4] last:mb-0">{children}</p>,
                                                            ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 text-sm text-[#e4e4e4]">{children}</ul>,
                                                            ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 text-sm text-[#e4e4e4]">{children}</ol>,
                                                            code: ({ children }) => <code className="rounded bg-[#171717] px-1.5 py-0.5 text-sm text-[#d9d9d9]">{children}</code>,
                                                            pre: ({ children }) => <pre className="mb-3 overflow-x-auto rounded-2xl bg-[#171717] p-4 text-sm text-[#d9d9d9]">{children}</pre>,
                                                            a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="text-[#7ce4dc] underline underline-offset-4">{children}</a>,
                                                        }}
                                                    >
                                                        {message.content}
                                                    </ReactMarkdown>
                                                    {message.sources?.length ? (
                                                        <div className="mt-3 flex flex-wrap gap-2">
                                                            {message.sources.map((source) => {
                                                                const hostname = new URL(source.url).hostname.replace("www.", "");
                                                                return (
                                                                    <a
                                                                        key={source.url}
                                                                        href={source.url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex max-w-full items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#141414] px-3 py-2 text-xs text-[#cfcfcf] transition hover:bg-[#1c1c1c]"
                                                                    >
                                                                        <img
                                                                            src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=64`}
                                                                            alt=""
                                                                            className="h-4 w-4 rounded-full"
                                                                        />
                                                                        <span className="max-w-40 truncate">{source.title || hostname}</span>
                                                                    </a>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : null}
                                                    <p className="mt-2 text-xs text-[#6e6e6e]">{formatTime(message.createdAt)}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="rounded-[24px] bg-[#1a1a1a] px-4 py-3 text-sm text-white">
                                                <p>{message.content}</p>
                                                <p className="mt-2 text-right text-xs text-[#777777]">{formatTime(message.createdAt)}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isTyping ? (
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#123c39] text-xs text-[#7ce4dc]">
                                            AI
                                        </div>
                                        <div className="rounded-full bg-[#151515] px-4 py-3 text-sm text-[#bdbdbd] animate-pulse">...</div>
                                    </div>
                                ) : null}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    <footer className="border-t border-[#1b1b1b] bg-[#0d0d0d]/95 px-4 py-4 backdrop-blur md:px-8">
                        <div className="mx-auto max-w-4xl rounded-[24px] border border-[#2a2a2a] bg-[#111111] p-3 sm:p-4">
                            <form onSubmit={handleSubmitMessage} className="flex items-end gap-3">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(event) => setChatInput(event.target.value)}
                                    placeholder="Ask anything..."
                                    disabled={isTyping}
                                    className="min-h-12 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#666666] disabled:cursor-not-allowed sm:text-base"
                                />
                                <button
                                    type="submit"
                                    disabled={!chatInput.trim() || isTyping}
                                    className="flex h-11 w-11 items-center justify-center rounded-full bg-[#20b2aa] text-lg text-white transition hover:bg-[#19978f] disabled:cursor-not-allowed disabled:bg-[#1f5e5a]"
                                    aria-label="Send message"
                                >
                                    <ArrowUpIcon />
                                </button>
                            </form>
                        </div>
                    </footer>
                </section>
            </section>
        </main>
    );
};

export default Dashboard;
