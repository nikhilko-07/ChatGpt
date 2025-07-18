import React, {useContext, useEffect, useState} from 'react';
import {MyContext} from "./MyContext.jsx";
import "./Chat.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github-dark.css';

export default function Chat(){
    const {newChats,prevChats, reply} = useContext(MyContext);
    const[latestReply,setLatestReply]=useState(null);

    useEffect(()=>{
        if(reply === null){
            setLatestReply(null);
            return;
        }
        if(!prevChats?.length)return;
        const content = reply.split(" "); //individual words
        let idx=0;
        const interval = setInterval(()=>{
            setLatestReply(content.slice(0, idx+1).join(" "));
            idx++;
            if(idx >= content.length) clearInterval(interval);
        } ,40)
        return () => clearInterval(interval);
    }, [prevChats, reply]);
    return (<>
        {prevChats.length == 0 && <h1>Start a New Chat!</h1>}
        <div className="chats">
            {
                prevChats?.map((chat,idx)=>
                    <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
                        {
                            chat.role === "user"?
                                <p className={"userMessage"}>{chat.content}</p> :
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                        }
                    </div>
                )
            }
            {
                prevChats.length > 0 && latestReply !== null &&
                <div className={"gptDiv"} key={"typing"}>
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                </div>
            }

        </div>
    </>)
}