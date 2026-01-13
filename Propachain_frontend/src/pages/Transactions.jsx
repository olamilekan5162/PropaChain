import { MessageSquare, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Transactions() {
  const navigate = useNavigate();

  const conversations = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Is the property still available?",
      time: "2 hours ago",
      unread: 2,
      avatar: "JD",
    },
    {
      id: 2,
      name: "Jane Smith",
      lastMessage: "Can we schedule a viewing?",
      time: "5 hours ago",
      unread: 0,
      avatar: "JS",
    },
  ];

  const handleConversationClick = (convId) => {
    navigate(`/app/chat/${convId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-8">
      <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 md:py-4 mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Messages
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Chat with buyers and sellers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-4">
        <div className="bg-white rounded-lg border border-gray-200">
          {conversations.length === 0 ? (
            <div className="p-8 md:p-12 text-center">
              <MessageSquare className="w-12 md:w-16 h-12 md:h-16 mx-auto text-gray-400 mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                No messages yet
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                Start browsing properties to connect with sellers
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleConversationClick(conv.id)}
                  className="w-full p-3 md:p-4 hover:bg-gray-50 transition-colors flex items-center gap-3 md:gap-4 min-h-[72px] md:min-h-[80px]"
                >
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm md:text-base text-teal-700 font-bold">
                      {conv.avatar}
                    </span>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm md:text-base text-gray-900 truncate">
                        {conv.name}
                      </span>
                      <span className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap ml-2 flex-shrink-0">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-5 md:w-6 h-5 md:h-6 bg-teal-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {conv.unread}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
