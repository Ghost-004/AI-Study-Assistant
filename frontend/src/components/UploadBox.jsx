import { useRef, useState } from "react";

export function UploadBox( { pdfFile, setPdfFile, handlePdfUpload, accept = ".pdf" } ){
	
    const fileInputRef = useRef(null);

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    const updateFile = (event) => {
        const file = event.target.files[0];
        if(file.type !== "application/pdf"){
            alert("Please upload a PDF");
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
                onDragOver={handleDragOver}
                onDrop={handleFileDrop}
                onClick={handleFileUpload}
            >
                Drop PDF here

                or click to upload
                {pdfFile && pdfFile.name}
                <input 
                    ref = {fileInputRef}
                    type = "file"
                    className="hidden"
                    accept = {accept}
                    onChange = {updateFile}
                />
                <button onClick={handlePdfUpload}>
                    Upload
                </button>
            </div>
        </>
    )
};