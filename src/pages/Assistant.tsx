import { useState, useRef, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Sparkles, User, Paperclip } from "lucide-react";

interface Msg {
  id: number;
  from: "bot" | "user";
  text: string;
}

const initialMessages: Msg[] = [
  {
    id: 1,
    from: "bot",
    text: "Hello 👋 I'm SPCAES Assistant. I can help you understand your rights, draft a clear complaint, and choose the right category. What happened?",
  },
];

const suggestions = [
  "My phone was stolen",
  "I received a fraud call",
  "Loud noise complaint",
  "Help me file a cyber complaint",
];

const Assistant = () => {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Date.now(), from: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply: Msg = {
        id: Date.now() + 1,
        from: "bot",
        text: generateReply(text),
      };
      setMessages((m) => [...m, reply]);
      setTyping(false);
    }, 1100);
  };

  const generateReply = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes("steal") || t.includes("stolen") || t.includes("theft")) {
      return "I understand — that sounds stressful. I recommend filing under **Theft / Robbery**. Please include:\n\n• Date, time and exact location\n• Description of stolen items (model, serial number)\n• Any witnesses or CCTV nearby\n\nWould you like me to pre-fill a complaint draft for you?";
    }
    if (t.includes("fraud") || t.includes("cyber") || t.includes("upi") || t.includes("scam")) {
      return "Cybercrime complaints need quick action. File this under **Cybercrime** and include:\n\n• Transaction IDs / screenshots\n• Phone numbers or UPI IDs involved\n• Date and amount lost\n\nShall I open the complaint form with these fields ready?";
    }
    if (t.includes("noise") || t.includes("loud")) {
      return "For noise issues, file under **Public Nuisance**. Include the time and source of the noise. Most resolutions happen within 24-48 hours.";
    }
    return "Thank you for sharing. Could you tell me a bit more — when did this happen and where? I'll help you choose the right category and draft a clear complaint.";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="container py-6 flex-1 flex flex-col max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4 animate-fade-in">
          <div className="relative">
            <div className="h-12 w-12 rounded-2xl gradient-teal flex items-center justify-center shadow-soft">
              <Bot className="h-6 w-6 text-secondary-foreground" />
            </div>
            <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success border-2 border-background" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold flex items-center gap-2">
              SPCAES Assistant <Sparkles className="h-4 w-4 text-secondary" />
            </h1>
            <p className="text-xs text-muted-foreground">Online · Replies in seconds</p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 rounded-2xl border border-border bg-card overflow-hidden flex flex-col shadow-soft">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 min-h-[400px] max-h-[60vh]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 animate-fade-in ${m.from === "user" ? "justify-end" : ""}`}
              >
                {m.from === "bot" && (
                  <div className="h-8 w-8 rounded-full gradient-teal flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-secondary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    m.from === "user"
                      ? "gradient-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
                {m.from === "user" && (
                  <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-accent-foreground" />
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex gap-3 animate-fade-in">
                <div className="h-8 w-8 rounded-full gradient-teal flex items-center justify-center shrink-0">
                  <Bot className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-typing" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-typing [animation-delay:200ms]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-typing [animation-delay:400ms]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 sm:px-6 py-3 border-t border-border flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="px-3 py-1.5 rounded-full text-xs bg-accent text-accent-foreground hover:bg-accent/70 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border p-3 flex items-center gap-2"
          >
            <Button type="button" variant="ghost" size="icon" className="shrink-0">
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your issue..."
              className="border-0 focus-visible:ring-0 bg-transparent"
            />
            <Button type="submit" variant="hero" size="icon" className="shrink-0 rounded-full" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-3">
          AI assistance is for guidance. Your complaint is officially filed only after submission.
        </p>
      </div>
    </div>
  );
};

export default Assistant;
