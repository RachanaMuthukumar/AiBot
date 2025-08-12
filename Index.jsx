import React, { useState, useEffect, useRef } from "react";
import Header from './Header';
function Index() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [hasTyped, setHasTyped] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    if (!hasTyped && value.trim() !== '') {
      setHasTyped(true);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      const botMessage = { sender: "gemini", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: "gemini", text: "Error fetching response." };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setInput("");
      setLoading(false);
    }
  };
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <>
      <Header clearChat={() => setMessages([])} />
      <div className="this">
        {!hasTyped && (
          <div>
        <img className='img'/>
          <p className="text">How can I assist you?</p></div>
        )}
        <div className="message-list">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="bubble">{msg.text}</div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={handleInputChange}
            disabled={loading}
            required
            className='input-text'
          />
          <button type="submit" disabled={loading} className='submit'>
            {loading ? "Thinking..." : <i className="bi bi-send-fill"></i>}
          </button>
        </form>
      </div>
    </>
  );
}
export default Index;