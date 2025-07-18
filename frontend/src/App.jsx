import './App.css'
import ChatWindow from "./ChatWindow.jsx";
import Sidebar from "./Sidebar.jsx";
import {MyContext} from "./MyContext.jsx";
import './App.css';
import {useState} from "react";
import {v1 as uuidv4} from "uuid";

function App() {
    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrentThreadId] = useState(uuidv4());
    const [prevChats, setPrevChats] = useState([]); //store all chat of curr thread
    const [newChats, setNewChats] = useState(true);
    const [allTreads, setAllTreads] = useState([]);

    const providerValues = {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setCurrentThreadId,
        prevChats,
        setPrevChats,
        newChats,
        setNewChats,
        allTreads,
        setAllTreads,
    };

  return (
    <div className="main">
        <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
        </MyContext.Provider>
    </div>
  )
}

export default App
