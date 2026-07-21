export function ChatWindow({ messages }){
    return (
        <div className="flex flex-col gap-4 p-4">
            {messages.map((message, index) => (
                <div 
                    key = {index}
                    className={`p-4 rounded-lg ${
                        message.role === "user"
                        ? "bg-blue-100 self-end max-w-[70%]"
                        : "bg-gray-100 self-start max-w-[70%]"
                    }`}>
                    <p className="font-semibold mb-1">
                        {message.role === "user" ? "user" : "assistant"}
                    </p>

                    <p>
                        {message.content}
                    </p>
                </div>
            ))}
        </div>
    )
}