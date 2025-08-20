import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./Routes/chat.js";

const app = express();
const PORT = 8181;

app.use(express.json());
app.use(cors());
app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log("Hello i am here on 8181");
  dbConection();
});

const dbConection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database Connection is secured!");
  } catch (err) {
    console.log(err);
  }
};

app.post("/test", async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // fixed here
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: req.body.message,
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.chatanywhere.tech/v1/chat/completions",
      options
    );
    const data = await response.json();
    // console.log(data);
    res.send(data);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});
