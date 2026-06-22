import { useEffect, useState } from "react";
import SearchBox from "./components/SearchBox";
import { askQuestion } from "./services/api";
import { ResponseBox } from "./components/ResponseBox";
import { sendPdf } from "./services/api";
import { UploadBox } from "./components/UploadBox";

export default function App() {
	const [message, setMessage] = useState("");
	const [question, setQuestion] = useState("");
	const [response, setResponse] = useState("");
	const[pdfFile, setPdfFile] = useState(null);

	async function handleAsk(question){
		const data = await askQuestion(question);
		setResponse(data.context);
	}
	async function handlePdfUpload() {
        if(!pdfFile) return;
        const data = await sendPdf(pdfFile);
        console.log(data);
    }

	useEffect(() => {
		fetch("http://localhost:5000/ai")
		.then((res) => res.json())
		.then((data) => setMessage(data.message))
	}, []);

	return (
		<>
			<SearchBox question = {question} setQuestion = {setQuestion} handleAsk = {handleAsk}/>
			<ResponseBox response = {response}/>
			<UploadBox pdfFile = {pdfFile} setPdfFile = {setPdfFile} handlePdfUpload = {handlePdfUpload}/>
		</>
	);
}