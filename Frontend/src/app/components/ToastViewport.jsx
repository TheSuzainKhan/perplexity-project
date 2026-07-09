import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError as clearAuthError } from "../../features/auth/auth.slice";
import { clearError as clearChatError } from "../../features/chat/chat.slice";

const ToastViewport = () => {
    const dispatch = useDispatch();
    const authError = useSelector((state) => state.auth.error);
    const chatError = useSelector((state) => state.chat.error);
    const [ toasts, setToasts ] = useState([]);

    const nextError = useMemo(() => {
        if (chatError) {
            return { key: `chat-${chatError}`, message: chatError, type: "chat" };
        }
        if (authError) {
            return { key: `auth-${authError}`, message: authError, type: "auth" };
        }
        return null;
    }, [ authError, chatError ]);

    useEffect(() => {
        if (!nextError) {
            return;
        }

        setToasts((current) => {
            if (current.some((toast) => toast.key === nextError.key)) {
                return current;
            }
            return [ ...current, { ...nextError, id: crypto.randomUUID() } ];
        });

        if (nextError.type === "auth") {
            dispatch(clearAuthError());
        } else {
            dispatch(clearChatError());
        }
    }, [ dispatch, nextError ]);

    useEffect(() => {
        if (!toasts.length) {
            return undefined;
        }

        const timer = setTimeout(() => {
            setToasts((current) => current.slice(1));
        }, 5000);

        return () => clearTimeout(timer);
    }, [ toasts ]);

    const dismissToast = (id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    };

    return (
        <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="pointer-events-auto rounded-2xl border border-red-500/40 bg-[#2a1113] px-4 py-3 text-sm text-red-100 shadow-lg shadow-black/40"
                >
                    <div className="flex items-start justify-between gap-3">
                        <p>{toast.message}</p>
                        <button
                            type="button"
                            onClick={() => dismissToast(toast.id)}
                            className="cursor-pointer text-red-200 transition hover:text-white"
                        >
                            x
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToastViewport;
