const { GoogleGenAI } = require('@google/genai');
const { AppError } = require('./error.handler');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.CHATBOT_KEY });

async function generateContent(contents) {
    if(!contents) throw new AppError('please provide message', 400);
    try{
        return await ai.models.generateContent({
            model: process.env.CHATBOT_MODEL,
            contents,
            config: {
                systemInstruction: "You are a assistant in a bloodbank management system web app. You need to answer the questions related to blood donation, debunk myths, and common faqs around blood. Politely refuse any other type of questions. Keep answers very short.",
            }
        });
    }catch(err){
        throw new AppError('Error in generateContent in ChatBot', 500, err);
    }
}

module.exports = {generateContent};
