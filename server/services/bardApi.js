const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");

const API_KEY = process.env.API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

async function sendToBard(data) {
  try {
    const prompt = data;
    const result = await client.generateText({
      model: "models/text-bison-001",
      prompt: {
        text: prompt,
      },
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error("Bard API error:", error);
    throw error;
  }
}

module.exports = {
  sendToBard,
};
