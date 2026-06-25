import api from "../api";

export const getDonors = async() =>{
    return await api.get('/donor');
} 

export const chatBot = async({contents}) =>{
    return await api.post('/donor/chatbot', {contents})
}