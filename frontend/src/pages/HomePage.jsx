import { useState } from "react";
import { askQuestion, sendPdf } from "../services/api";
import { SearchBox } from "../components/SearchBox";
import { ResponseBox } from "../components/ResponseBox";
import { UploadBox } from "../components/UploadBox";
import { Header } from "../components/Header";

export function HomePage() {
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [sources, setSources] = useState([]);
	const [loading, setLoading] = useState(false);
	const[pdfFile, setPdfFile] = useState(null);

	/**
	 	{
			"email":"test@test.com",
			"password":"password123"
		}
		{
			"email":"abc123@gmail.com",
			"password":"quickfox"
		}
	 */

	async function handleAsk(question){
		setLoading(true);
		try {
			const data = await askQuestion(question);

			setAnswer(data.answer);
			setSources(data.sources);
		}
		finally {
			setLoading(false);
		}
	}

	async function handlePdfUpload() {
        if(!pdfFile){
			alert("Please select a PDF");
			return;
		}

		const data = await sendPdf(pdfFile);
		alert(
			`Uploaded successfully.
			${data.chunks} chunks created`
		);

    }

	return (
		<>
            <Header />
            <div className="max-w-5xl mx-auto p-8 ">
                
                <div className="mb-8">
                    <SearchBox question = {question} setQuestion = {setQuestion} handleAsk = {handleAsk}/>
                </div>
                <div className="mb-8">
                    <UploadBox pdfFile = {pdfFile} setPdfFile = {setPdfFile} handlePdfUpload = {handlePdfUpload}/>
                </div>
                <div className="mb-8">
                    <ResponseBox answer={answer} sources={sources} loading={loading}/>
                </div>
            </div>
		</>
	);
}