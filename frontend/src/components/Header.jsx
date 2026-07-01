export function Header(){
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

                <div>
                    <h1 className="text-2xl font-bold text-blue-600">
                        AI Study Assistant
                    </h1>

                    <p className="text-sm text-gray-500">
                        Chat with your study material
                    </p>
                </div>

                <nav className="flex gap-6">
                    <button className="text-gray-600 hover:text-blue-600">
                        Home
                    </button>

                    <button className="text-gray-600 hover:text-blue-600">
                        Dashboard
                    </button>

                    <button className="text-gray-600 hover:text-blue-600">
                        Analytics
                    </button>
                </nav>

            </div>
        </header>
    );
}