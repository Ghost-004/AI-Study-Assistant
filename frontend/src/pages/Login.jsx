import { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

export function Login (){
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setError("");

        const data = await(login(email, password));

        if(data.token){
            localStorage.setItem(
                "token",
                data.token
            );

            navigate("/");
        }
        else{
            setError(data.error);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded shadow">
            <h1 className="text-2xl font-bold mb-6">
                Login
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
                onChange={(e) =>  setPassword(e.target.value)}
            />

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}

            <button
                className="bg-blue-600 text-white w-full px-4 py-2 rounded"
                onClick={handleLogin}
            >
                Login
            </button>
        </div>
    )
}