import "./App.css";

import Chatwindow from "./Chatwindow";
import Sidewindow from "./Sidewindow";
import { MyContext } from "./MyContext";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import { use } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currthreadId, setThreadId] = useState(uuidv1());
  const [newChat, setNewChat] = useState(true);
  const [prevChats, setPrevChats] = useState([]);
  const [threads, setthreads] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const getAllthreads = async () => {
    try {
      const reply = await fetch("https://vaani-1-4cmq.onrender.com/api/thread");
      const res = await reply.json();
      // console.log(res);
      setthreads(res);
    } catch (e) {
      console.log(e);
    }
  };
  const providerValues = {
    prompt,
    setPrompt,
    isOpen,
    setIsOpen,
    reply,
    setReply,
    currthreadId,
    setThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    threads,
    setthreads,
    getAllthreads,
  };
  return (
    <section
      className="main"
      onClick={() => {
        if (isOpen) setIsOpen(false);
      }}
    >
      <MyContext.Provider value={providerValues}>
        <Sidewindow />
        <Chatwindow />
      </MyContext.Provider>
    </section>
  );
}

export default App;
