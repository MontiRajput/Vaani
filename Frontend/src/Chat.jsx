import "./Chat.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import dragon from "./assets/dragon.svg";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestword, setlatestword] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setlatestword(null);
      return;
    }
    if (!prevChats?.length) return;

    const content = reply.split(" ");
    let idx = 0;

    const interval = setInterval(() => {
      setlatestword(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 20);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  return (
    <>
      {newChat ? (
        <div className="temp">
          <img src={dragon} alt="" />
          <h3 style={{ fontSize: "35px" }}>
            Okay, let’s kick off a new conversation!
          </h3>
        </div>
      ) : (
        <div className="chats">
          {/* render all but last message */}
          {prevChats.slice(0, -1).map((chat, idx) =>
            chat.role === "user" ? (
              <div className="user" key={idx}>
                {chat.content}
              </div>
            ) : (
              <div className="assistant" key={idx}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              </div>
            )
          )}

          {/* render last message with typing effect if assistant */}
          {prevChats.length > 0 &&
            (prevChats[prevChats.length - 1].role === "assistant" ? (
              <div className="assistant" key={"last"}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {latestword ?? prevChats[prevChats.length - 1].content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="user" key={"last"}>
                {prevChats[prevChats.length - 1].content}
              </div>
            ))}
        </div>
      )}
    </>
  );
}

export default Chat;
