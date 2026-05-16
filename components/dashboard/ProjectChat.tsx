"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/components/providers/SocketProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, Image as ImageIcon, Loader2, User } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import toast from "react-hot-toast";

interface ProjectChatProps {
  projectId: string;
}

export function ProjectChat({ projectId }: ProjectChatProps) {
  const { data: session } = useSession();
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  let typingTimeout: NodeJS.Timeout | null = null;

  // Fetch past messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["chat", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/messages?projectId=${projectId}`);
      const json = await res.json();
      if (!json.success) throw new Error("Failed to load messages");
      return json.data.messages;
    },
    enabled: !!projectId,
  });

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // Socket setup
  useEffect(() => {
    if (!socket || !isConnected || !projectId) return;

    socket.emit("join_chat", projectId);

    const handleNewMessage = (message: any) => {
      queryClient.setQueryData(["chat", projectId], (old: any) => [...(old || []), message]);
    };

    const handleUserTyping = ({ userName }: { userName: string }) => {
      if (userName === session?.user?.name) return;
      setTypingUsers(prev => {
        const next = new Set(prev);
        next.add(userName);
        return next;
      });
    };

    const handleUserStopTyping = ({ userName }: { userName: string }) => {
      setTypingUsers(prev => {
        const next = new Set(prev);
        next.delete(userName);
        return next;
      });
    };

    socket.on("new-message", handleNewMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      socket.emit("leave_chat", projectId);
      socket.off("new-message", handleNewMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [socket, isConnected, projectId, queryClient, session?.user?.name]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { content: string, attachments?: any[] }) => {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          content: messageData.content || (messageData.attachments?.length ? "Sent an attachment" : ""),
          attachments: messageData.attachments || [],
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      return json.data.message;
    },
    onSuccess: () => {
      setContent("");
      setAttachments([]);
      if (socket && isConnected) {
        socket.emit("stop_typing", { projectId, userName: session?.user?.name });
      }
    },
    onError: () => {
      toast.error("Failed to send message");
    }
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image uploads are supported currently");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file); // Must match API route expects "image"

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Upload failed");
      
      const newAttachment = {
        url: data.url,
        name: file.name,
        type: file.type,
      };

      // Auto-send message with attachment if there's no text, or add to pending attachments
      sendMessageMutation.mutate({ content, attachments: [newAttachment] });
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);

    if (socket && isConnected) {
      socket.emit("typing", { projectId, userName: session?.user?.name });

      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit("stop_typing", { projectId, userName: session?.user?.name });
      }, 2000);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate({ content });
  };

  return (
    <div className="flex flex-col h-full bg-[#12181F] rounded-xl border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-white/[0.02] border-b border-white/[0.06] flex items-center justify-between">
        <h3 className="text-sm font-bold text-white tracking-tight">Project Chat</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500">Live</span>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px] min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-white/20">
            <User className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-sm font-bold">No messages yet</p>
            <p className="text-xs">Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg: any) => {
            const isMe = msg.sender.id === session?.user?.id;
            return (
              <div key={msg._id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <div className="w-8 h-8 rounded-full bg-white/10 shrink-0 overflow-hidden relative flex items-center justify-center">
                  {msg.sender.avatar ? (
                    <Image src={msg.sender.avatar} alt={msg.sender.name} fill className="object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-white/50">{msg.sender.name.charAt(0)}</span>
                  )}
                </div>
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase text-white/40">{msg.sender.name}</span>
                    <span className="text-[9px] font-medium text-white/20">{format(new Date(msg.createdAt), "HH:mm")}</span>
                  </div>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-emerald-500 text-white rounded-tr-sm" : "bg-white/[0.04] text-white/90 rounded-tl-sm border border-white/[0.04]"}`}>
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mb-2 max-w-[200px] overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(msg.attachments[0].url, "_blank")}>
                        <img src={msg.attachments[0].url} alt="Attachment" className="w-full h-auto object-contain rounded-lg border border-white/10" />
                      </div>
                    )}
                    {msg.content !== "Sent an attachment" && msg.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {/* Typing indicator */}
        {typingUsers.size > 0 && (
          <div className="flex items-center gap-2 text-white/40 text-xs font-medium italic animate-pulse">
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            {Array.from(typingUsers).join(", ")} {typingUsers.size === 1 ? "is" : "are"} typing...
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center gap-2 relative">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept="image/*" 
        />
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-2 text-white/40 hover:text-white/80 hover:bg-white/5 rounded-xl transition-colors disabled:opacity-50"
        >
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
        </button>
        <input
          type="text"
          value={content}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="flex-1 bg-white/[0.04] border border-white/[0.06] focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder:text-white/20 text-sm rounded-xl px-4 py-2.5 outline-none transition-all"
        />
        <button 
          type="submit" 
          disabled={!content.trim() || sendMessageMutation.isPending}
          className="p-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white rounded-xl transition-colors"
        >
          {sendMessageMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}
