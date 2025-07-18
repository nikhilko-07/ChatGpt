import React, {useContext, useEffect} from 'react';
import './Sidebar.css';
import {MyContext} from "./MyContext.jsx";
import {v1 as uuidv4} from "uuid";

export default function Sidebar(){
    const { allTreads, setAllTreads, currThreadId, setNewChats, setPrompt, setReply, setCurrentThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:9000/api/thread");
            const res = await response.json();
            const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
            setAllTreads(filteredData);
        }catch(err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getAllThreads();
    },[currThreadId]);

    const createNewChat = ()=>{
        setNewChats(true);
        setPrompt("");
        setReply(null);
        setCurrentThreadId(uuidv4());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrentThreadId(newThreadId);
        try {
            const response = await fetch(`http://localhost:9000/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChats(false);
            setReply(null);
        } catch (err) {
            console.error("Error in changeThread:", err);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:9000/api/thread/${threadId}`, {method: 'DELETE'});
            const res = await response.json();
            console.log(res);

            //updatedc threads re-render
            setAllTreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId){
                createNewChat();
            }
        }catch(err) {
            console.log(err);
        }
    }

    return (<section className={"sidebar"}>
        <button onClick={createNewChat} className={"button"}>
            <img className="logo" src={"https://download.logo.wine/logo/ChatGPT/ChatGPT-Logo.wine.png"}/>
            <i className="fa-solid fa-pen-to-square"></i>
        </button>

        <ul className={"history"}>
        <li>history1</li>
            {
                allTreads?.map((thread, index) => (
                    <li onClick={(e) => changeThread(thread.threadId)} key={index}>{thread.title} <i
                        className="fa-solid fa-trash"
                        onClick={(e)=> {
                            e.stopPropagation();//stop event bubling
                            deleteThread(thread.threadId);
                        }}
                    ></i></li>
                ))
            }
            </ul>

            <div className={"sign"}>
                <p>By Nikhil Kohli &hearts;</p>
            </div>
    </section>)
}