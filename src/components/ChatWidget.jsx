"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  ChevronDown,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import {
  askChatbot,
  createPublicMessage,
  getPublicFaqs,
} from "@/pages/api/messagesAPI";

const starterMessages = [
  {
    sender: "bot",
    text: "Hi, I can answer common questions instantly. If I cannot find an answer, I will send your message to the team.",
  },
];

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [faqs, setFaqs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [contactSaving, setContactSaving] = useState(false);
  const [contactStatus, setContactStatus] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const data = await getPublicFaqs();
        setFaqs((data.data || data.faqs || []).slice(0, 6));
      } catch {
        setFaqs([]);
      }
    };

    loadFaqs();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  const addMessage = (message) => {
    setMessages((current) => [...current, message]);
  };

  const sendQuestion = async (question) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || loading) return;

    addMessage({ sender: "visitor", text: cleanQuestion });
    setInput("");
    setLoading(true);

    try {
      const data = await askChatbot({
        question: cleanQuestion,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
      });

      addMessage({
        sender: "bot",
        text: data.answer || "Thanks, I sent that to the Index IT Hub team.",
        type: data.type,
      });

      if (data.type === "handoff") {
        setShowContact(true);
      }
    } catch {
      addMessage({
        sender: "bot",
        text: "I could not send that right now. Please email info@indexithub.com and the team will help.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendQuestion(input);
  };

  const saveContactDetails = async () => {
    const hasContact = contact.email.trim() || contact.phone.trim();
    if (!hasContact) {
      setContactStatus("Add an email or phone number for follow-up.");
      return;
    }

    const lastQuestion =
      [...messages].reverse().find((message) => message.sender === "visitor")?.text ||
      "Visitor requested a chatbot follow-up.";

    try {
      setContactSaving(true);
      setContactStatus("");
      await createPublicMessage({
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        source: "chatbot",
        subject: "Chatbot follow-up contact",
        category: "Chatbot",
        message: `Follow-up requested from chatbot.\n\nLatest question: ${lastQuestion}`,
      });
      setContactStatus("Thanks, your contact details were added to the inbox.");
    } catch {
      setContactStatus("Could not save contact details. Please try again.");
    } finally {
      setContactSaving(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-5 z-[998] sm:right-8">
      {open && (
        <div className="mb-4 flex h-[min(74vh,620px)] w-[calc(100vw-2.5rem)] max-w-[390px] flex-col overflow-hidden rounded-lg border border-white/70 bg-white shadow-2xl shadow-slate-950/20 dark:border-white/10 dark:bg-neutral-950">
          <div className="bg-[#13294b] p-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-light text-slate-950">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-extrabold">Index Assistant</h2>
                  <p className="text-xs font-semibold text-slate-300">
                    FAQ answers and message handoff
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 dark:bg-neutral-900">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`flex ${message.sender === "visitor" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 ${
                    message.sender === "visitor"
                      ? "bg-[#13294b] text-white dark:bg-brand-light dark:text-slate-950"
                      : "border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-neutral-950 dark:text-slate-200"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-neutral-950 dark:text-slate-300">
                  Checking FAQs...
                </div>
              </div>
            )}
          </div>

          {faqs.length > 0 && (
            <div className="border-t border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-neutral-950">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-light">
                <Sparkles className="h-3.5 w-3.5" />
                Quick questions
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {faqs.slice(0, 4).map((faq) => (
                  <button
                    key={faq._id || faq.question}
                    type="button"
                    onClick={() => sendQuestion(faq.question)}
                    className="shrink-0 rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-brand-light hover:text-[#1E3A8A] dark:border-white/10 dark:text-slate-300 dark:hover:text-white"
                  >
                    {faq.category || "FAQ"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showContact && (
            <div className="border-t border-slate-200 bg-[#eef6ff] p-4 dark:border-white/10 dark:bg-white/[0.04]">
              <button
                type="button"
                onClick={() => setShowContact(false)}
                className="mb-3 flex w-full items-center justify-between text-sm font-bold text-[#1E3A8A] dark:text-white"
              >
                Add contact for follow-up
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="grid gap-2">
                <label className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={contact.name}
                    onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand-light dark:border-white/10 dark:bg-neutral-950"
                    placeholder="Name"
                  />
                </label>
                <label className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={contact.email}
                    onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand-light dark:border-white/10 dark:bg-neutral-950"
                    placeholder="Email"
                  />
                </label>
                <label className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={contact.phone}
                    onChange={(event) => setContact((current) => ({ ...current, phone: event.target.value }))}
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand-light dark:border-white/10 dark:bg-neutral-950"
                    placeholder="Phone"
                  />
                </label>
              </div>

              {contactStatus && (
                <p className="mt-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {contactStatus}
                </p>
              )}

              <button
                type="button"
                onClick={saveContactDetails}
                disabled={contactSaving}
                className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#13294b] px-4 text-sm font-bold text-white transition hover:bg-slate-950 disabled:opacity-60 dark:bg-brand-light dark:text-slate-950"
              >
                {contactSaving ? "Saving..." : "Send contact details"}
                <Send className="h-4 w-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-4 text-sm outline-none focus:border-brand-light focus:ring-4 focus:ring-[#5FA5FA]/20 dark:border-white/10 dark:bg-white/[0.04]"
              placeholder="Ask a question..."
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-light text-slate-950 transition hover:bg-[#4F96EE] disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#13294b] text-white shadow-2xl shadow-slate-950/25 ring-4 ring-white/70 transition hover:-translate-y-1 hover:bg-slate-950 dark:bg-brand-light dark:text-slate-950 dark:ring-neutral-950/70"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default ChatWidget;
