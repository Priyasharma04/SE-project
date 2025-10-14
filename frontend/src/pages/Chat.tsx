import { useState, useEffect } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import PDFUpload from "@/components/PDFUpload";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

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
  pdf_name?: string;
}

// DEMO: Hardcoded review for any PDF - shown immediately after upload
const HARDCODED_REVIEW = `##  Summary
This paper presents a novel approach with significant contributions to its research domain. The authors propose innovative methodologies and demonstrate strong empirical results through comprehensive experiments.

## Strengths
- Well-structured methodology with rigorous experimental design
- Comprehensive evaluation showing 15-20% improvement over baselines
- Good coverage of related work with clear positioning
- Reproducibility - code and models made available
- Clear presentation with effective visualizations

## Weaknesses & Suggested Fixes
**1. Limited dataset diversity** - Add cross-domain evaluation on 2-3 additional datasets
**2. Computational cost not analyzed** - Include FLOPs, memory usage, and training time comparison
**3. Statistical significance missing** - Add error bars and significance tests over multiple runs
**4. Incomplete ablation studies** - Systematic analysis of each component's contribution
**5. Edge cases underexplored** - Discuss failure modes and limitations

## Suggested Experiments
- Cross-domain generalization testing
- Adversarial robustness evaluation (FGSM, PGD attacks)
- Few-shot learning with limited data (10%, 25%, 50%)
- Comparison with 2024-2025 state-of-the-art methods
- Real-world deployment case study
- Scalability analysis with varying input sizes
- Interpretability visualization studies
- Energy efficiency and carbon footprint analysis

## Policy & Ethical Considerations
- **Data Privacy:** Ensure no PII in training data, document collection methodology
- **Societal Impact:** Discuss potential misuse scenarios and fairness across demographics
- **Environmental:** Report CO2 emissions and computational accessibility
- **Transparency:** Full reproducibility with code, data, and documentation

##  Decision: **MINOR REVISION**
Strong paper with solid contributions. Strengths outweigh weaknesses. Address computational analysis and statistical tests for acceptance at top-tier venue.

**Confidence Score: 85%**`;

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [hasUploadedPDF, setHasUploadedPDF] = useState(false);
  const [currentPDFName, setCurrentPDFName] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const { toast } = useToast();
  
  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const response = await chatAPI.getChats();
      const chats = response.data.chats.map((chat: any) => ({
        id: chat.id,
        title: chat.title,
        lastMessage: chat.lastMessage,
        timestamp: new Date(chat.timestamp),
        pdf_name: chat.pdf_name
      }));
      setChatHistory(chats);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  // Save current chat before starting new one
  const saveCurrentChat = async () => {
    if (messages.length === 0) return;

    try {
      const chatId = currentChatId || `chat_${Date.now()}`;
      const title = currentPDFName 
        ? `${currentPDFName.substring(0, 30)}...` 
        : messages[0]?.content.substring(0, 30) + "..." || "Untitled Chat";

      const chatData = {
        chat_id: chatId,
        title,
        messages: messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        })),
        pdf_name: currentPDFName
      };

      await chatAPI.saveChat(chatData);
      
      // Add to local history if it's a new chat
      if (!currentChatId) {
        setChatHistory(prev => [
          {
            id: chatId,
            title,
            lastMessage: messages[messages.length - 1]?.content.substring(0, 50) || "",
            timestamp: new Date(),
            pdf_name: currentPDFName
          },
          ...prev
        ]);
      } else {
        // Update existing chat in history
        setChatHistory(prev => prev.map(chat => 
          chat.id === chatId 
            ? {
                ...chat,
                title,
                lastMessage: messages[messages.length - 1]?.content.substring(0, 50) || "",
                timestamp: new Date()
              }
            : chat
        ));
      }

      setCurrentChatId(chatId);
    } catch (error) {
      console.error("Failed to save chat:", error);
      toast({
        title: "Error",
        description: "Failed to save chat history",
        variant: "destructive"
      });
    }
  };

  // DEMO: Send message with hardcoded intelligent responses
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Generate intelligent response based on question
    setTimeout(async () => {
      const q = content.toLowerCase();
      let response = "";
      
      if (q.includes("summar")) {
        response = "**Summary:** The paper presents novel methodology with 15-20% improvement over baselines. Well-structured with comprehensive experiments. Needs dataset diversity expansion and computational cost analysis.";
      } else if (q.includes("strength")) {
        response = "**Key Strengths:**\n✅ Rigorous methodology\n✅ Strong results (15-20% improvement)\n✅ Good reproducibility\n✅ Clear presentation\n✅ Comprehensive experiments";
      } else if (q.includes("weakness")) {
        response = "**Main Weaknesses:**\n⚠️ Limited dataset diversity\n⚠️ No computational cost analysis\n⚠️ Missing statistical significance tests\n⚠️ Incomplete ablation studies\n⚠️ Limited failure case discussion";
      } else if (q.includes("experiment")) {
        response = "**Suggested Experiments:**\n🔬 Cross-domain testing\n🔬 Adversarial robustness\n🔬 Few-shot learning\n🔬 Latest baselines comparison\n🔬 Scalability analysis";
      } else if (q.includes("decision") || q.includes("accept")) {
        response = "**Decision: MINOR REVISION**\n\nStrong contributions with solid validation. Address computational analysis and statistical tests for acceptance.";
      } else if (q.includes("improve")) {
        response = "**Key Improvements:**\n1. Add computational cost analysis\n2. Include statistical significance tests\n3. Expand to 2-3 more datasets\n4. Complete ablation studies\n5. Add failure case analysis";
      } else {
        response = `About "${content}":\n\nThe paper shows strong potential in this area. This aspect should be addressed in revision with additional experiments or deeper analysis.`;
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      
      // Auto-save after AI response
      setTimeout(() => {
        saveCurrentChat();
      }, 500);
    }, 800);
  };

  // DEMO: Handle PDF upload and show hardcoded review
  const handlePDFUpload = async (file: File) => {
    console.log("Processing PDF:", file.name);
    setCurrentPDFName(file.name);
    
    // Simulate processing delay
    setTimeout(() => {
      const reviewMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `# 📄 Research Paper Review: ${file.name}\n\n${HARDCODED_REVIEW}\n\n---\n\n **Ask me anything!** Questions about strengths, weaknesses, experiments, or any aspect of the review.`,
        timestamp: new Date(),
      };
      
      setMessages([reviewMessage]);
      setHasUploadedPDF(true);
    }, 1500);
  };

  const handleSelectChat = async (chatId: string) => {
    // Save current chat before switching
    if (messages.length > 0 && currentChatId !== chatId) {
      await saveCurrentChat();
    }

    setCurrentChatId(chatId);
    
    try {
      const response = await chatAPI.getChat(chatId);
      const chatData = response.data;
      
      const loadedMessages = chatData.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp)
      }));
      
      setMessages(loadedMessages);
      setCurrentPDFName(chatData.pdf_name || "");
      setHasUploadedPDF(true);
      
      toast({
        title: "Chat Loaded",
        description: `Loaded: ${chatData.title}`
      });
    } catch (error) {
      console.error("Failed to load chat:", error);
      toast({
        title: "Error",
        description: "Failed to load chat",
        variant: "destructive"
      });
    }
  };

  const handleNewChat = async () => {
    // Save current chat before starting new one
    if (messages.length > 0) {
      await saveCurrentChat();
    }
    
    setMessages([]);
    setCurrentChatId(null);
    setHasUploadedPDF(false);
    setCurrentPDFName("");
    
    toast({
      title: "New Chat",
      description: "Previous chat saved. Start a new conversation!"
    });
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
          <h1 className="text-lg font-semibold">Research Paper Assistant</h1>
          <div className="w-10" /> {/* Spacer for center alignment */}
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-bold text-gradient">
                    Welcome to Research Paper Assistant
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Upload a PDF document of your research paper to start asking questions and get instant insights
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
