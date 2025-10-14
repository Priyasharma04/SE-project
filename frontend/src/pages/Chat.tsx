import { useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import PDFUpload from "@/components/PDFUpload";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [hasUploadedPDF, setHasUploadedPDF] = useState(false);
  
  // BACKEND INTEGRATION: Load chat history from your API
  const [chatHistory] = useState<ChatHistory[]>([
    // Example data - replace with actual API call
    {
      id: "1",
      title: "Research Paper Analysis",
      lastMessage: "Can you summarize the methodology section?",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "2",
      title: "Contract Review",
      lastMessage: "What are the key terms in section 3?",
      timestamp: new Date(Date.now() - 7200000),
    },
  ]);

  // BACKEND INTEGRATION: Send message to your chat API
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // TODO: Replace with your actual chat API call
    console.log("Sending message:", content);
    // Example API call:
    // const response = await fetch("/api/chat", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${localStorage.getItem("token")}`
    //   },
    //   body: JSON.stringify({
    //     chatId: currentChatId,
    //     message: content,
    //     pdfContext: hasUploadedPDF
    //   })
    // });
    // const data = await response.json();

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "This is a simulated response. Your backend team will connect the actual AI here.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  // BACKEND INTEGRATION: Handle PDF upload to your server
  const handlePDFUpload = async (file: File) => {
    console.log("Uploading PDF:", file.name);
    // TODO: Replace with your actual PDF upload API
    // const formData = new FormData();
    // formData.append("pdf", file);
    // formData.append("chatId", currentChatId || "new");
    // 
    // const response = await fetch("/api/upload-pdf", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${localStorage.getItem("token")}`
    //   },
    //   body: formData
    // });
    // const data = await response.json();
    // if (data.success) {
    //   setHasUploadedPDF(true);
    //   setCurrentChatId(data.chatId);
    // }
    
    setHasUploadedPDF(true);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // BACKEND INTEGRATION: Load messages for selected chat
    // const response = await fetch(`/api/chats/${chatId}/messages`);
    // const data = await response.json();
    // setMessages(data.messages);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setHasUploadedPDF(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        isOpen={isSidebarOpen}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card shadow-card">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">PDF Chat Assistant</h1>
          <div className="w-10" /> {/* Spacer for center alignment */}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-gradient">
                    Welcome to PDF Chat Assistant
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Upload a PDF document to start asking questions and get instant insights
                  </p>
                </div>
                <PDFUpload onUpload={handlePDFUpload} />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        {messages.length > 0 && (
          <ChatInput onSend={handleSendMessage} disabled={!hasUploadedPDF} />
        )}
      </div>
    </div>
  );
};

export default Chat;
