import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const Chatbot = () => {
    const [user, setUser] = useState({ name: "", phone: "", email: "", message: "" });
    const [chat, setChat] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (user.phone) {
            socket.emit("join", user.phone);
            socket.on(`reply-${user.phone}`, (data) => {
                setChat(prevChat => [...prevChat, { sender: "owner", message: data.message }]);
            });

            return () => socket.off(`reply-${user.phone}`);
        }
    }, [user.phone]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:5000/send-message", user);
        setChat([{ sender: "user", message: user.message }]);
        setSubmitted(true);
    };

    return (
        <div className="chat-container">
            {!submitted ? (
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" required onChange={(e) => setUser({ ...user, name: e.target.value })} />
                    <input type="tel" placeholder="Phone" required onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                    <input type="email" placeholder="Email" required onChange={(e) => setUser({ ...user, email: e.target.value })} />
                    <textarea placeholder="Message" required onChange={(e) => setUser({ ...user, message: e.target.value })}></textarea>
                    <button type="submit">Send</button>
                </form>
            ) : (
                <div className="chat-box">
                    {chat.map((msg, index) => (
                        <p key={index} className={msg.sender === "user" ? "user-msg" : "owner-msg"}>
                            {msg.message}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Chatbot;
