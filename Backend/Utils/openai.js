import "dotenv/config";

const openAiResponse = async (message) => {
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
          role: "system",
          content:
            "You are Vanii, an AI assistant created by Monti Rajput. Never say you are ChatGPT. only introduce whenever user ask who are you.",
        },
        {
          role: "user",
          content: message,
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
    return data.choices[0].message.content;
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

export default openAiResponse;
