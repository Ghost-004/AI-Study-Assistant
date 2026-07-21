import { useRef } from "react";

export function SearchBox({
    question,
    setQuestion,
    handleAsk,
    pdfFile,
    setPdfFile,
    handlePdfUpload,
    uploadStatus,
    accept = ".pdf,.docx,.pptx,.txt"
})
{
    const fileInputRef = useRef(null);
    
    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const updateFile = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please upload a supported document.");
            event.target.value = "";
            return;
        }

        setPdfFile(file);

        try {
            await handlePdfUpload(file);
        } finally {
            setPdfFile(null);

            event.target.value = "";
        }
    };

    function handleSubmit(e){
        e.preventDefault();
        console.log("submitted");
        handleAsk(question);
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-5s">
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={accept}
                onChange={updateFile}
            />
            <button
                type="button"
                onClick={handleFileUpload}
                className="px-3 py-2 border rounded-lg"
            >
                📎
            </button>
            {pdfFile && (
                <span className="text-sm text-gray-600 max-w-40 truncate">
                    📄 {pdfFile.name}
                </span>
            )}
            {uploadStatus && (
                <div
                    className={`text-sm ${
                        uploadStatus.type === "success"
                            ? "text-green-600"
                            : "text-red-600"
                    }`}
                >
                    {uploadStatus.type === "success" ? "✓" : "⚠"} {uploadStatus.message}
                </div>
            )}
            <input 
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text" onChange={(e) => {setQuestion(e.target.value)}} value={question}/>
            <button
                className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700"
                class={"border-1px"} type="submit">
                Ask
            </button>
        </form>
    )
}