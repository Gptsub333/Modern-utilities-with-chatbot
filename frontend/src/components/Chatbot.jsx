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
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("chat_user");
        return savedUser ? JSON.parse(savedUser) : { name: "", phone: "", email: "", message: "" };
    });

    const [chat, setChat] = useState(() => {
        const savedChat = localStorage.getItem("chat_history");
        return savedChat ? JSON.parse(savedChat) : [{ sender: "bot", message: "Hi there! How can I assist you today?" }];
    });

    const [submitted, setSubmitted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(() => localStorage.getItem("chat_step") || "greeting");
    const [replyMessage, setReplyMessage] = useState("");
    const audioRef = useRef(new Audio(notificationSound));
    const chatEndRef = useRef(null);

    // Store chat and user in localStorage on update
    useEffect(() => {
        localStorage.setItem("chat_history", JSON.stringify(chat));
    }, [chat]);

    useEffect(() => {
        localStorage.setItem("chat_user", JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem("chat_step", step);
    }, [step]);

    useEffect(() => {
        if (user.phone) {
            socket.emit("join", user.phone);
            
            // Correctly format the event name
            const eventName = `reply-${user.phone}`;
            
            socket.on(eventName, (data) => {
                setChat(prevChat => {
                    const updatedChat = [...prevChat, { sender: "owner", message: data.message }];
                    localStorage.setItem("chat_history", JSON.stringify(updatedChat)); // Save in localStorage
                    return updatedChat;
                });
                playSound();
            });
    
            return () => {
                socket.off(eventName); // Clean up the event listener
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
        setChat(prevChat => {
            const updatedChat = [...prevChat, { sender: "user", message }];
    
            // Get bot response
            const botResponse = { sender: "bot", message: predefinedResponses[message] };
    
            // Append bot response immediately (not in setTimeout)
            const newChat = [...updatedChat, botResponse];
    
            // Save in localStorage
            localStorage.setItem("chat_history", JSON.stringify(newChat));
    
            return newChat;
        });
    
        playSound();
        if (message === "Services") setStep("form");
    };    

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${B_url}/send-message`, user);
        setChat(prevChat => {
            const updatedChat = [...prevChat, { sender: "user", message: user.message }];
            localStorage.setItem("chat_history", JSON.stringify(updatedChat)); // Save in localStorage
            return updatedChat;
        });
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

    const handleClearChat = () => {
        setChat([{ sender: "bot", message: "Hi there! How can I assist you today?" }]);
        setUser({ name: "", phone: "", email: "", message: "" });
        setStep("greeting");
        localStorage.removeItem("chat_history");
        localStorage.removeItem("chat_user");
        localStorage.removeItem("chat_step");
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
                        <button 
                            onClick={() => {
                                setIsOpen(false);
                                localStorage.removeItem("chat_history"); // Clear chat when closed
                                localStorage.removeItem("chat_user");
                                localStorage.removeItem("chat_step");
                            }} 
                            className="text-white hover:text-gray-300"
                        >
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
    <div className="flex flex-wrap gap-2 mt-2">
        <button 
            className="border border-gray-400 px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition"
            onClick={() => handleUserSelection("Learn About Us")}>
            Learn About Us
        </button>
        <button 
            className="border border-gray-400 px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition"
            onClick={() => handleUserSelection("See our reviews")}>
            See Reviews
        </button>
        <button 
            className="border border-gray-400 px-3 py-1 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition"
            onClick={() => handleUserSelection("Services")}>
            Services
        </button>
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

<div className="mt-4">
    <button 
        onClick={handleClearChat} 
        className="border border-red-500 text-red-500 px-3 py-1 text-sm rounded-md hover:bg-red-500 hover:text-white transition"
    >
        Clear Chat
    </button>
</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
