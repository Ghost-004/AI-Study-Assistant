export function Sidebar({ sessions, selectedSession, setSelectedSession }){
    return (
        <div className="w-72 h-[calc(100vh-80px)] border-r border-gray-800 p-4">
            <button className="w-full mb-4 bg-blue-600 text-white py-2 rounded">
                + New Chat
            </button>

            <div>
                {sessions.map(session => (
                    <div
                        key={session.id}
                        onClick={() => setSelectedSession(session.id)}
                        className={`
                            p-3 rounded-lg cursor-pointer transition
                            ${
                                selectedSession === session.id
                                    ? "bg-blue-100"
                                    : "hover:bg-gray-200"
                            }
                        `}
                    >
                        {session.title}
                    </div>
                ))}
            </div>
        </div>
    )   
}