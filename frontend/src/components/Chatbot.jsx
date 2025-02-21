import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { MessageCircle, X, Send } from "lucide-react";
import notificationSound from "../assets/notification.mp3";

const B_url = import.meta.env.VITE_URL || "http://localhost:5000";
const socket = io(B_url);

const predefinedResponses = {
    "Learn About Us": "We are a company dedicated to providing the best services for our customers.",
    "See our reviews": "Our customers love us! Check out their testimonials on our website.",
    "Services": "Please fill out the form below to inquire about our services."
};

const Chatbot = () => {
    const [user, setUser] = useState({ name: "", phone: "", email: "", message: "" });
    const [chat, setChat] = useState([{ sender: "bot", message: "Hi there! How can I assist you today?" }]);
    const [submitted, setSubmitted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState("greeting");
    const [replyMessage, setReplyMessage] = useState("");
    const audioRef = useRef(new Audio(notificationSound));
    const chatEndRef = useRef(null);

    useEffect(() => {
        if (user.phone) {
            socket.emit("join", user.phone);
            socket.on(`reply-${user.phone}`, (data) => {
                setChat(prevChat => [...prevChat, { sender: "owner", message: data.message }]);
                playSound();
            });
            return () => {
                socket.off(`reply-${user.phone}`);
            };
        }
    }, [user.phone]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat, step]);

    const playSound = () => {
        audioRef.current.play();
    };

    const handleUserSelection = (message) => {
        setChat(prevChat => [...prevChat, { sender: "user", message }]);
        setTimeout(() => {
            setChat(prevChat => [...prevChat, { sender: "bot", message: predefinedResponses[message] }]);
        }, 500);
        playSound();
        if (message === "Services") setStep("form");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${B_url}/send-message`, user);
        setChat(prevChat => [...prevChat, { sender: "user", message: user.message }]);
        setSubmitted(true);
        playSound();
        setStep("greeting");
    };

    const handleReply = async () => {
        if (!replyMessage.trim()) {
            alert("Please enter a reply message.");
            return;
        }
        const replyData = { phone: user.phone, message: replyMessage };
        try {
            await axios.post(`${B_url}/send-reply`, replyData);
            setReplyMessage("");
            playSound();
        } catch (error) {
            alert("Failed to send reply. Please try again.");
        }
    };

    return (
        <div>
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
                >
                    <MessageCircle size={28} />
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-5 right-5 w-80 sm:w-96 bg-white border rounded-lg shadow-lg h-[500px] overflow-y-auto">
                    <div className="flex items-center justify-between bg-blue-600 text-white p-3 rounded-t-lg">
                        <h2 className="text-lg font-semibold">Chatbot</h2>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-300">
                            <X size={22} />
                        </button>
                    </div>
                    <div className="p-4">
                        <div className="p-3 space-y-2">
                            {chat.map((msg, index) => (
                                <div key={index} className={`p-2 my-1 max-w-[75%] ${msg.sender === "user" ? "bg-blue-500 text-white ml-auto rounded-br-lg rounded-tl-lg rounded-bl-lg" : "bg-gray-200 text-gray-700 mr-auto rounded-bl-lg rounded-tr-lg rounded-br-lg"}`}>
                                    {msg.message}
                                </div>
                            ))}
                            <div ref={chatEndRef}></div>
                        </div>

                        {step === "greeting" && (
                            <div>
                                <div className="space-y-2">
                                    <button className="w-full bg-gray-200 p-2 rounded-md text-left" onClick={() => handleUserSelection("Learn About Us")}>Learn About Us</button>
                                    <button className="w-full bg-gray-200 p-2 rounded-md text-left" onClick={() => handleUserSelection("See our reviews")}>See our Reviews</button>
                                    <button className="w-full bg-gray-200 p-2 rounded-md text-left" onClick={() => handleUserSelection("Services")}>Services</button>
                                </div>
                            </div>
                        )}

                        {step === "form" && (
                            <form onSubmit={handleSubmit} className="space-y-3 mt-3">
                                <input type="text" placeholder="Name" required className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300" onChange={(e) => setUser({ ...user, name: e.target.value })} />
                                <input type="tel" placeholder="Mobile No." required className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300" onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                                <input type="email" placeholder="Email" required className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300" onChange={(e) => setUser({ ...user, email: e.target.value })} />
                                <textarea placeholder="Reason / Message" required className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-300" onChange={(e) => setUser({ ...user, message: e.target.value })}></textarea>
                                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Send</button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
