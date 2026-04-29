import Groq from "groq-sdk";

let client;

export function getGroqClient() {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
}
