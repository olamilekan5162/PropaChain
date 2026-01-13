import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Image as ImageIcon,
} from "lucide-react";

export default function ChatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  // Mock conversation data
  const conversation = {
    id: id,
    name: "John Doe",
    avatar: "JD",
    property: {
      title: "5 Bedroom Duplex in Lekki Phase 1",
      price: "₦85,000,000",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
    },
  };

  const messages = [
    {
      id: 1,
      sender: "other",
      text: "Hello! I'm interested in this property.",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "me",
      text: "Great! The property is still available. Would you like to schedule a viewing?",
      time: "10:35 AM",
    },
    {
      id: 3,
      sender: "other",
      text: "Yes, I'd love to. Is the property still available?",
      time: "10:40 AM",
    },
    {
      id: 4,
      sender: "me",
      text: "Absolutely! When would you like to visit?",
      time: "10:42 AM",
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Handle send message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-2 md:px-4 py-2 md:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <button
              onClick={() => navigate("/app/transactions")}
              className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 md:w-5 h-4 md:h-5" />
            </button>
            <div className="w-8 md:w-10 h-8 md:h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm md:text-base text-teal-700 font-bold">
                {conversation.avatar}
              </span>
            </div>
            <div className="min-w-0">
              <h2 className="font-semibold text-sm md:text-base text-gray-900 truncate">
                {conversation.name}
              </h2>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>

          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Phone className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
            </button>
            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Video className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
            </button>
            <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Property Card */}
      <div className="bg-white border-b border-gray-200 px-2 md:px-4 py-2 md:py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
            <img
              src={conversation.property.image}
              alt={conversation.property.title}
              className="w-12 md:w-16 h-12 md:h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-semibold text-gray-900 line-clamp-2">
                {conversation.property.title}
              </p>
              <p className="text-sm md:text-base text-teal-700 font-bold">
                {conversation.property.price}
              </p>
            </div>
            <button
              onClick={() => navigate(`/property/${id}`)}
              className="text-teal-700 text-xs md:text-sm font-medium hover:text-teal-800 whitespace-nowrap flex-shrink-0 self-center"
            >
              View
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4 py-4 md:py-6 pb-24 md:pb-6">
        <div className="max-w-4xl mx-auto space-y-3 md:space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] ${
                  msg.sender === "me"
                    ? "bg-teal-700 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                } rounded-2xl px-3 md:px-4 py-2 md:py-2.5`}
              >
                <p className="text-xs md:text-sm">{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.sender === "me"
                      ? "text-white opacity-70"
                      : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-14 md:bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 md:px-4 py-2 md:py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <Paperclip className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
          </button>
          <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
            <ImageIcon className="w-4 md:w-5 h-4 md:h-5 text-gray-600" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 md:p-2.5 bg-teal-700 text-white rounded-full hover:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
