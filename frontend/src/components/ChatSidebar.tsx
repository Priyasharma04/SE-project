import { MessageSquare, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ChatHistory } from "@/pages/Chat";

interface ChatSidebarProps {
  isOpen: boolean;
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onClose: () => void;
}

const ChatSidebar = ({
  isOpen,
  chatHistory,
  currentChatId,
  onSelectChat,
  onNewChat,
  onClose,
}: ChatSidebarProps) => {
  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    // Close sidebar on mobile after selecting
    if (window.innerWidth < 1024) {
      onClose();
    }
  };
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (hours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-sidebar-border">
            <Button
              onClick={onNewChat}
              className="w-full gradient-primary shadow-elegant hover:opacity-90 transition-smooth"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Chat History */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider mb-3">
                Recent Chats
              </h3>
              {chatHistory.length === 0 ? (
                <p className="text-sm text-sidebar-foreground/60 text-center py-8">
                  No chats yet. Start a new conversation!
                </p>
              ) : (
                chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-smooth hover:bg-sidebar-accent group",
                      currentChatId === chat.id && "bg-sidebar-accent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-4 h-4 mt-1 text-sidebar-foreground/60 group-hover:text-primary transition-smooth" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-sidebar-foreground truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-sidebar-foreground/60 truncate mt-1">
                          {chat.lastMessage}
                        </p>
                        <p className="text-xs text-sidebar-foreground/40 mt-1">
                          {formatTimestamp(chat.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/60 text-center">
              <p></p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
