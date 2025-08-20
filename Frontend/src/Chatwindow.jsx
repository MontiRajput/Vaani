import "./Chatwindow.css";
import Chat from "./Chat.jsx";
import logo from "./assets/logo-text.png";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState } from "react";
import { DotLoader } from "react-spinners";
import { useRef, useEffect } from "react";

function Chatwindow() {
  const {
    prompt,
    setPrompt,
    isOpen,
    setIsOpen,
    setReply,
    currthreadId,
    prevChats,
    setPrevChats,
    setNewChat,
    getAllthreads,
  } = useContext(MyContext);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [prevChats]);
  const getReply = async (msg) => {
    // make sure we got a string (not a MouseEvent) and it's not empty
    if (typeof msg !== "string") return;

    msg = msg.trim();
    if (!msg) return;

    // show user message immediately
    setReply(null);
    setPrevChats((chats) => [...chats, { role: "user", content: msg }]);

    setPrompt("");
    setNewChat(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8181/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          threadId: currthreadId,
          count: prevChats.length,
        }),
      });

      const res = await response.json();
      if (prevChats.length == 2) {
        getAllthreads();
      }
      // store assistant reply
      setReply(res.reply);
      setPrevChats((chats) => [
        ...chats,
        { role: "assistant", content: res.reply },
      ]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const profileOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="chatwindow">
      <div className="navbar">
        <img src={logo} alt="" />
        <div className="info" onClick={() => profileOpen()}>
          <i className="fa-solid fa-user"></i>
        </div>
      </div>
      {isOpen && (
        <div className="profile">
          <div className="user-mail ">
            <i class="fa-regular fa-user"></i> &nbsp;mrrajput7082@gmail.com
          </div>
          <div className="profile-icons">
            <i class="fa-solid fa-gears"></i> &nbsp;Setting
          </div>
          <div className="profile-icons">
            {" "}
            <i class="fa-solid fa-circle-info"></i> Help
          </div>
          <div className="profile-icons">
            <i class="fa-solid fa-arrow-right-from-bracket"></i> &nbsp;Logout
          </div>
        </div>
      )}

      <Chat ref={messagesEndRef} />

      <DotLoader loading={loading} className="loader" />

      <div className="chat-input">
        <div className="user-input">
          <input
            placeholder="Lets Discuss"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") getReply(prompt);
            }}
          />
          <div id="submit" onClick={() => getReply(prompt)}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>

        <p>
          I might get things wrong sometimes — so please double-check anything
          important!
        </p>
      </div>
    </section>
  );
}

export default Chatwindow;
