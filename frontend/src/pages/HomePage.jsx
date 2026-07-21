import { useState, useEffect } from "react";
import { askQuestion, getChatSessions, sendPdf, getMessages } from "../services/api";
import { SearchBox } from "../components/SearchBox";
import { ResponseBox } from "../components/ResponseBox";
import { UploadBox } from "../components/UploadBox";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";

export function HomePage() {
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [sources, setSources] = useState([]);
	const [loading, setLoading] = useState(false);
	const[pdfFile, setPdfFile] = useState(null);

	const [sessions, setSessions] = useState([]);
	const [selectedSession, setSelectedSession] = useState(null);
	const [messages, setMessages] = useState([]);
	const [uploadStatus, setUploadStatus] = useState("");
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

	useEffect(() => {
		fetchSession();
	}, []);

	useEffect(() => {
		if (!selectedSession) return;

		loadMessages(selectedSession);
	}, [selectedSession]);

	useEffect(() => {
		if (!uploadStatus) return;

		const timer = setTimeout(() => {
			setUploadStatus(null);
		}, 3000); // Hide after 3 seconds

		return () => clearTimeout(timer);
	}, [uploadStatus]);

	async function fetchSession() {
		try{
			const data = await getChatSessions();
			setSessions(data);
		}
		catch(err){
			console.error(err);
		}
	}

	async function loadMessages(sessionId) {
		try {
			const data = await getMessages(sessionId);
			setMessages(data);
		}
		catch (err) {
			console.error(err);
		}
	}

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

	async function handlePdfUpload(file) {
		try {
			await sendPdf(file);

			setUploadStatus({
				type: "success",
				message: `${file.name} uploaded successfully`
			});
		} catch (err) {
			setUploadStatus({
				type: "error",
				message: err.message
			});
		}
	}
	return (
		<div className="">
			<main className="flex flex-col h-screen">
				<Header />
				<div className="flex flex-1 min-h-0">
					<Sidebar 
						sessions={sessions}
						selectedSession={selectedSession}
						setSelectedSession={setSelectedSession}
					/>
					<div className="flex flex-col flex-1 p-5">
						<div className="flex-1 overflow-y-auto">
							<ChatWindow messages={messages} />
						</div>

						<div className="border-t pt-4">
							<SearchBox
								question={question}
								setQuestion={setQuestion}
								handleAsk={handleAsk}
								pdfFile={pdfFile}
								setPdfFile={setPdfFile}
								handlePdfUpload={handlePdfUpload}
								uploadStatus={uploadStatus}
								setUploadStatus={setUploadStatus}
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}