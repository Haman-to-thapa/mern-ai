import { useActionState, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type LoginState = {
  error: string;
};

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    async (_, formData) => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
        return { error: "" };
      }
      return { error: useAuthStore.getState().error };
    },
    { error: "" }
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        action={formAction}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        {state.error && (
          <p className="text-red-500 text-sm mb-4 text-center">{state.error}</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border w-full p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            required
            className="border w-full p-3 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>

        <button
          disabled={isPending}
          className="bg-black hover:bg-gray-800 transition text-white w-full p-3 rounded-lg font-medium disabled:opacity-60"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          No account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
