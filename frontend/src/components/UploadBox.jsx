import { useRef, useState } from "react";

export function UploadBox( { pdfFile, setPdfFile, handlePdfUpload, accept = ".pdf,.docx,.pptx,.txt" } ){
	
    const fileInputRef = useRef(null);

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const updateFile = (event) => {
        const file = event.target.files[0];
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain"
        ];

        if(!allowedTypes.includes(file.type)){
            alert("Please upload a supported document.");
            return;
        }
        setPdfFile(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            if(file.type !== "application/pdf"){
                alert("Please upload a PDF");
                return;
            }
            setPdfFile(file);
        }
    };

    return (
        <>
            <div
                className="bg-white rounded shadow cursor-pointer transition"
                onDragOver={handleDragOver}
                onDrop={handleFileDrop}
                onClick={handleFileUpload}
            >
                <h2 className="text-xl font-semibold mb-4">
                    Upload Study Material
                </h2>
                {pdfFile && (
                    <p className="mt-4 text-green-600 font-medium">
                        Selected: {pdfFile.name}
                    </p>
                )}
                <input  
                    ref = {fileInputRef}
                    type = "file"
                    className="hidden"
                    accept = {accept}
                    onChange = {updateFile}
                />
                <button 
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePdfUpload();
                    }}
                >
                    Upload
                </button>
            </div>
        </>
    )
};