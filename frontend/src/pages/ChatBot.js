import { useState } from 'react';
import { chatBot } from '../services/donorApiService';

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    try {
        const res = await chatBot({contents : input});
        // console.log(res.data);
        if(res.data.success){
            setMessages([...newMessages, { role: 'assistant', content: res.data.data}]);
        }
        else{
            setError(res.data.message);
            setTimeout(() => setError(''), 10000);
        }
    } catch (err) {
        setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <div>
        {(error) && <p>{error}</p>}
        <div className="chatbot-container p-4 shadow rounded bg-light">
            <div className="chat-window" style={{ maxHeight: 400, overflowY: 'auto' }}>
                {messages.map((msg, i) => (
                <div key={i} className={`my-2 ${msg.role === 'user' ? 'text-end' : 'text-start'}`}>
                    <span className={`badge ${msg.role === 'user' ? 'bg-primary' : 'bg-success'}`}>
                    {msg.content}
                    </span>
                </div>
                ))}
            </div>
            <div className="input-group mt-3">
                <input
                type="text"
                className="form-control"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about blood donation..."
                />
                <button className="btn btn-primary" onClick={handleSend}>Send</button>
            </div>
        </div>
    </div>
    
  );
};

export default ChatBot;
