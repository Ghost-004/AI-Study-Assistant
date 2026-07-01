import { useEffect, useState } from "react";
import { askQuestion, sendPdf } from "./services/api";
import { SearchBox } from "./components/SearchBox";
import { ResponseBox } from "./components/ResponseBox";
import { UploadBox } from "./components/UploadBox";
import { Header } from "./components/Header"

export default function App() {
	const [question, setQuestion] = useState("");

	const [answer, setAnswer] = useState("");
	const [sources, setSources] = useState([]);
	const [loading, setLoading] = useState(false);

	const[pdfFile, setPdfFile] = useState(null);

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

	useEffect(() => {
		fetch("http://localhost:5000/ai")
		.then((res) => res.json())
		.then((data) => setMessage(data.message))
	}, []);
	return (
		<>
			<div className="min-h-screen bg-gray-100">
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
			</div>
		</>
	);
}