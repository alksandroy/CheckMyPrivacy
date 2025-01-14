import { Configuration, OpenAI } from "openai";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import validator from 'validator';

const configuration = new Configuration({
  organization: "org-BNDruJYSc32aDKfZ1wifbJDS",
  apiKey: "sk-proj-czjB8J9W3qldpVlhy9L9T3BlbkFJFZHbhi5GEx8P6RT29JV8",
});

const openai = new OpenAI(configuration);

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req, res) => {
  const userInput = req.body.text;
  const taskResponse = handleTask(userInput);

  if (taskResponse) {
    return res.json({ reply: taskResponse });
  }

  try {
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userInput }],
    });

    res.json({
      reply: completion.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Failed to fetch response from OpenAI:", error);
    res.status(500).json({ error: "Error processing your request" });
  }
});

async function handleTask(input) {
  const system = "You are a specialized digital assistant with expertise in summarizing and interpreting privacy policies of websites. Your primary role is to analyze privacy policies, either directly from a website URL provided by the user or a specific excerpt of a policy given by the user. Your style is analytical and concise, capable of translating complex legal language into straightforward, understandable summaries. After analyzing, you will provide a clarity score based on the complexity and transparency of the policy, followed by a brief summary of its key points. Next, you will offer specific action items that users can take to enhance their privacy protection on the specific site. Finally, you will recommend 2 other websites whose privacy policies the user should also check out and explain why. You can use previous data on what users also search for to guide how the 2 websites are selected. Your ultimate goal is to empower users with a clear understanding of privacy policies and practical steps to better safeguard their online privacy."

  let chatLog = "Please provide the URL of the website's privacy policy you want to analyze or paste a specific excerpt of a policy for analysis."

  const response = await callGPTAI(system, chatLog);

  chatLog += "User: " + content + "\n";
  chatLog += "Chat Bot: " + response + "\n";

  return response;
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});