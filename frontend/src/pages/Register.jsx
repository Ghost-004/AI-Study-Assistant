import { useState } from "react";
import { register } from "../services/api";

export function Register({ email, password }){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        const data = await register(email, password);

        if (!data.error) {
            alert("Registration successful!");
            onRegister();
        }
        else{
            setError(data.error);
        }
    }

    return (
        <div>
            <h1>
                Register
            </h1>
            <input 
                className=""
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                className=""
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
        </div>
    )
}