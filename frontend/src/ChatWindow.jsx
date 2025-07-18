import React, {useEffect, useState} from "react";
import "./ChatWindow.css"
import Chat from "./Chat.jsx";
import {MyContext} from "./MyContext.jsx";
import {useContext} from "react";
import {ScaleLoader} from "react-spinners";

export default function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, setPrevChats} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        setLoading(true);

        console.log("message", prompt, "threadId", currThreadId);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId,
            })
        };

        try {
            const response = await fetch("http://localhost:9000/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        } catch (err) {
            console.error("Error fetching reply:", err);
        }
        setLoading(false);
    };

    //Append new chat to prevChat
    useEffect(() => {
        if(prompt && reply){
            setPrevChats(prevChats =>(
                [...prevChats,{
                    role:"user",
                    content:prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ))
        }
        setPrompt("");
    }, [reply])

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={"ChatWindow"}>
            <div className={"navbar"}>
                <span>Chat Gpt <i className="fa-solid fa-chevron-down"></i></span>

                <div className={"userIconDiv"} onClick={handleProfileClick}>
        <span className={"userIcon"}>
            <i className="fa-solid fa-user"></i>
        </span>
                </div>

                {isOpen && (
                    <div className={"dropDown"}>
                        <div className={"dropDownItem"}>
                            <i className="fa-solid fa-up-right-from-square"></i> Upgrade Plan
                        </div>
                        <div className={"dropDownItem"}>
                            <i className="fa-solid fa-gear"></i> Setting
                        </div>
                        <div className={"dropDownItem"}>
                            <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                        </div>
                    </div>
                )}
            </div>


            <Chat></Chat>
            <ScaleLoader color={"white"} loading={loading}/>
            <div className={"chatInput"}>
                <div className={"inputBox"}>
                    <input onKeyDown={(e) => e.key ==='Enter' ? getReply() : ''} value={prompt} onChange={(e)=>setPrompt(e.target.value)} className={"input"} placeholder={"Ask anything"}/>
                    <div  onClick={getReply} id={"submit"}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className={"info"}>
                    ChatGpt can make mistakes. Check important info. See cookie Preferences.
                </p>
            </div>
        </div>
    )
}