"use client";
import { MessageCircle, X, Send } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export default function ChatWidget() {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl mb-4 overflow-hidden border border-stone-200 transition-all">
          {/* Header */}
          <div className="bg-amber-600 text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-semibold">Restaurant Assistant</h3>
            <button onClick={toggleChat} className="text-white/80 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          {/* Messages Area (Dummy Data) */}
          <div className="h-64 bg-stone-50 p-4 overflow-y-auto space-y-4 text-sm">
            <div className="bg-white border border-stone-200 text-stone-700 p-3 rounded-2xl rounded-tl-sm w-11/12 shadow-sm">
              Hi there! 👋 Welcome to The Golden Fork. Do you have any questions about our menu or hours?
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-stone-100 flex gap-2">
            <input 
              type="text" 
              placeholder="Type a question..." 
              className="flex-grow bg-stone-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500"
              disabled
            />
            <button className="bg-amber-600 text-white p-2 rounded-full hover:bg-amber-700 disabled:opacity-50" disabled>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button 
        onClick={toggleChat}
        className="w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-stone-800 transition transform hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}