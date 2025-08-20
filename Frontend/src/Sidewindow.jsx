import "./Sidewindow.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import dragon from "./assets/dragon.svg";
import { v1 as uuidv1 } from "uuid";

function Sidewindow() {
  const {
    threads,
    setthreads,
    setPrompt,
    currthreadId,
    setThreadId,
    setPrevChats,
    setReply,
    setNewChat,
    getAllthreads,
  } = useContext(MyContext);
  const [isActive, setisActive] = useState(true);
  useEffect(() => {
    getAllthreads();
  }, []); // only run once on mount

  const changeThread = async (newThreadId) => {
    try {
      setThreadId(newThreadId);
      const res = await fetch(
        `http://localhost:8181/api/thread/${newThreadId}`
      );
      const data = await res.json();
      setPrevChats(data);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error("Error fetching thread:", err);
    }
  };

  const deleteThread = async (deletethreadID) => {
    try {
      await fetch(`http://localhost:8181/api/thread/${deletethreadID}`, {
        method: "DELETE",
      });
      await getAllthreads();

      if (deletethreadID === currthreadId) {
        getNewChat();
      }
    } catch (err) {
      console.error("Error deleting thread:", err);
    }
  };

  const getNewChat = async () => {
    setNewChat(true);
    setPrompt("");
    setThreadId(uuidv1());
    setPrevChats([]);
  };

  return (
    <section className={` ${isActive ? "side-window" : ""}`}>
      <div className="top">
        <img
          src={dragon}
          alt="Dragon logo"
          className={`logo ${isActive ? "" : "flx"}`}
          onClick={() => setisActive(true)}
        />
        {isActive && (
          <i
            className="fa-brands fa-xing tag"
            onClick={() => setisActive(false)}
          ></i>
        )}
      </div>
      {isActive && (
        <>
          {" "}
          <div className="tools" onClick={getNewChat}>
            <i className="fa-brands fa-medrt"></i> &nbsp; New Chat
          </div>
          <div className="connect">
            <p className="hide-title">Connect</p>
            <a
              href="https://www.montirajput.space/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-connectdevelop"></i>&nbsp; Portfolio
            </a>
            <a
              href="https://www.linkedin.com/in/monti-rajput/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-linkedin-in"></i> &nbsp;LinkedIn
              Profile
            </a>
          </div>
          <p className="hide-title">History</p>
          <ul className="history">
            {threads.length > 0 &&
              threads.map((thread) => (
                <li
                  className={`links ${
                    thread.threadId === currthreadId ? "highlighted" : ""
                  }`}
                  key={thread.threadId}
                  onClick={() => changeThread(thread.threadId)}
                >
                  <p>{thread.title}</p>
                  <i
                    className="fa-regular fa-trash-can"
                    onClick={() => deleteThread(thread.threadId)}
                  ></i>
                </li>
              ))}
          </ul>
          <div className="sign">
            <i className="fa-solid fa-user"></i>
            <p>By Monti Rajput &hearts;</p>
          </div>
        </>
      )}
    </section>
  );
}

export default Sidewindow;
