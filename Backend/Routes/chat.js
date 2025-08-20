import express from "express";
import Thread from "../Models/thread.js";
import openAIResponcer from "../Utils/openai.js";
const router = express.Router();

//if i wants all created threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.send(threads);
  } catch (err) {
    res.status(500).send(err);
  }
});

//if i want to get any created thread
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      res.status(401).send("Thread not found.");
    }
    res.send(thread.messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

//if i wants to delete any of my thread
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOneAndDelete({ threadId });
    if (!thread) {
      res.status(401).send("Thread not found.");
    }
    res.send(`${threadId} is deleted successfully.`);
  } catch (err) {
    res.status(500).send(err);
  }
});

//for create new route and provide message or only for provide message and save it in atlas
router.post("/chat", async (req, res) => {
  const { threadId, message, count } = req.body;

  if (!threadId || !message) {
    res.status(400).send("Requried fields are empty!");
  }

  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        threadId,
        title: "New Chat",
        messages: [{ role: "user", content: message }],
      });
    } else {
      if (count == 2) {
        const title = await openAIResponcer(
          `provide me the best short title of max 6 words for this without brackets and in only english "${message}"`
        );
        thread.title = title;
      }
      thread.messages.push({ role: "user", content: message });
    }
    const assistantReply = await openAIResponcer(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

export default router;
