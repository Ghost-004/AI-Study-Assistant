import { useState } from "react";
import { register } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export function Register(){
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        setError("");
        const data = await register(email, password);

        if (data.message) {
            alert(data.message);
            navigate("/login");
        }
        else{
            setError(data.error);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">
                Register
            </h1>
            <input 
                className="border w-full p-2 mb-4"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                className="border w-full p-2 mb-4"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}
            <button
                className="bg-blue-600 text-white w-full px-4 py-2 rounded"
                onClick={handleRegister}
            >
                Register
            </button>
            <p className="mt-4 text-center text-gray-600">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-blue-600 hover:underline"
                >
                    Login
                </Link>
            </p>
        </div>
    )
}