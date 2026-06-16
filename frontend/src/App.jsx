import { useEffect, useState } from "react";
import SearchBox from "./components/SearchBox";
import { askQuestion } from "./services/api";
import { ResponseBox } from "./components/ResponseBox";

export default function App() {
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");

  async function handleAsk(question){
    console.log(question);
    const data = await askQuestion(question);
    console.log(data);
    setResponse(data.context);
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
    </>
  );
}