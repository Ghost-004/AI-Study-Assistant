import { useEffect, useState } from "react";

export default function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/ai")
    .then((res) => res.json())
    .then((data) => setMessage(data.message))
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <h1 className="text-5xl font-bold text-cyan-400">
        {message}
      </h1>
    </div>
  );
}