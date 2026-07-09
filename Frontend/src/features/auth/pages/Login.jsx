import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { handleLogin } = useAuth();

    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const submitForm = async (event) => {
        event.preventDefault();

        try {
            await handleLogin({ email, password });
            navigate("/");
        } catch {
            return;
        }
    };

    if (!loading && user) {
        return <Navigate to="/" replace />;
    }

    return (
        <section className="min-h-screen bg-[#0d0d0d] px-4 py-6 text-white sm:px-6 sm:py-10">
            <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center justify-center sm:min-h-[85vh]">
                <div className="w-full rounded-[28px] border border-[#1c1c1c] bg-[#101010] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] sm:p-8">
                    <div className="mb-10 text-center">
                        <div className="mb-4 flex items-center justify-center gap-3">
                            <span className="h-3 w-3 rounded-full bg-[#20b2aa]" />
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Perplexity</h1>
                        </div>
                        <p className="text-sm text-[#8b8b8b]">Sign in to continue your research threads.</p>
                    </div>

                    {location.state?.message ? (
                        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                            {location.state.message}
                        </div>
                    ) : null}

                    <form onSubmit={submitForm} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Email"
                            required
                            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/30"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password"
                            required
                            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-[#20b2aa] focus:ring-2 focus:ring-[#20b2aa]/30"
                        />

                        {error ? <p className="text-sm text-red-400">{error}</p> : null}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#20b2aa] px-4 py-3 font-semibold text-white transition hover:bg-[#1ca39c] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Login"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-[#6c6c6c]">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="text-[#bcbcbc] transition hover:text-white">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
