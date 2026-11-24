import { AnimatePresence, motion } from "framer-motion";
import { FiMessageCircle, FiMinus, FiX } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";

const prompts = ["What does Aryan build?", "What is the main stack?", "How can I get in touch?"];

function replyFor(message, email) {
  const question = message.toLowerCase();
  if (/(build|frontend|interface)/.test(question)) {
    return { text: "Aryan builds frontend UI work with clear information hierarchy, responsive layouts and purposeful motion—primarily in React.", action: { label: "See approach", href: "#about" } };
  }
  if (/(contact|email|linkedin|hire|reach)/.test(question)) {
    return { text: "You can email Aryan directly or use LinkedIn. The contact section also includes the GitHub profile and portfolio source.", action: { label: "Email Aryan", href: `mailto:${email}` } };
  }
  if (/(project|work|gamily|hungry|ink)/.test(question)) {
    return { text: "The selected-work section covers Ink Creative Studio, Gamily and Hungry Tiger, including the brief, contribution, stack and outcomes for each.", action: { label: "See selected work", href: "#work" } };
  }
  if (/(stack|skill|react|javascript|technology|tech)/.test(question)) {
    return { text: "Aryan’s current focus is React, JavaScript, Node.js, Python and SQL—paired with responsive UI work and thoughtful motion.", action: { label: "See approach", href: "#about" } };
  }
  if (/(experience|highradius|intern)/.test(question)) {
    return { text: "Aryan worked as a CRM Intern at HighRadius from October 2023 to February 2024. The experience section also explains the interface and motion craft he brings to projects.", action: { label: "See experience", href: "#experience" } };
  }
  if (/(resume|résumé|cv)/.test(question)) {
    return { text: "The résumé is available directly from the approach section.", action: { label: "Download résumé", href: "/Resume.pdf", download: true } };
  }
  return { text: "I can help you find Aryan’s work, technical focus, experience, résumé or contact details. Try one of the quick prompts below." };
}

export function PortfolioChatbot({ email }) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: "welcome", role: "bot", text: "Hi, I’m Aryan’s portfolio guide. What would you like to know?" },
  ]);
  const inputRef = useRef(null);
  const messagesRef = useRef(null);
  const launcherRef = useRef(null);
  const responseTimer = useRef(0);
  const messageSequence = useRef(0);

  useEffect(() => () => window.clearTimeout(responseTimer.current), []);

  useEffect(() => {
    if (!open || minimized) return undefined;
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setMinimized(false);
      window.setTimeout(() => launcherRef.current?.focus(), 0);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.setTimeout(() => inputRef.current?.focus(), 120);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [minimized, open]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (value) => {
    const cleanMessage = value.trim();
    if (!cleanMessage) return;
    messageSequence.current += 1;
    const id = `message-${messageSequence.current}`;
    setMessages((current) => [...current, { id, role: "user", text: cleanMessage }]);
    setInput("");
    window.clearTimeout(responseTimer.current);
    responseTimer.current = window.setTimeout(() => {
      const answer = replyFor(cleanMessage, email);
      setMessages((current) => [...current, { id: `${id}-reply`, role: "bot", ...answer }]);
    }, 360);
  };

  const closeGuide = () => {
    setOpen(false);
    setMinimized(false);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  };

  const minimizeGuide = () => {
    setMinimized(true);
    window.setTimeout(() => launcherRef.current?.focus(), 0);
  };

  return (
    <aside className="portfolio-chat" aria-label="Portfolio guide">
      <AnimatePresence>
        {open && !minimized && (
          <motion.section
            className="portfolio-chat__panel"
            role="region"
            id="portfolio-chat-panel"
            aria-labelledby="portfolio-chat-title"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 330, damping: 26 }}
          >
            <header className="portfolio-chat__header">
              <div><span className="portfolio-chat__status" aria-hidden="true" /><p>Portfolio guide</p><h2 id="portfolio-chat-title">A quick way to explore.</h2></div>
              <div className="portfolio-chat__controls"><button type="button" onClick={minimizeGuide} aria-label="Minimize portfolio guide"><FiMinus /></button><button type="button" onClick={closeGuide} aria-label="Close portfolio guide"><FiX /></button></div>
            </header>
            <div className="portfolio-chat__messages" ref={messagesRef} aria-live="polite">
              {messages.map((message) => (
                <div className={`portfolio-chat__message portfolio-chat__message--${message.role}`} key={message.id}>
                  <p>{message.text}</p>
                  {message.action && <a href={message.action.href} download={message.action.download || undefined} onClick={closeGuide}>{message.action.label}</a>}
                </div>
              ))}
            </div>
            <div className="portfolio-chat__prompts" aria-label="Suggested questions">
              {prompts.map((prompt) => <button type="button" key={prompt} onClick={() => sendMessage(prompt)}>{prompt}</button>)}
            </div>
            <form className="portfolio-chat__form" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
              <label className="sr-only" htmlFor="portfolio-chat-input">Ask about Aryan’s portfolio</label>
              <input ref={inputRef} id="portfolio-chat-input" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about the portfolio" autoComplete="off" />
              <button type="submit" disabled={!input.trim()}>Send</button>
            </form>
            <p className="portfolio-chat__note">Client-side portfolio guide · No messages are stored.</p>
          </motion.section>
        )}
      </AnimatePresence>
      <motion.button
        className={`portfolio-chat__launcher${open && !minimized ? " is-open" : ""}`}
        ref={launcherRef}
        type="button"
        onClick={() => { setOpen(true); setMinimized(false); }}
        aria-expanded={open && !minimized}
        aria-controls={open && !minimized ? "portfolio-chat-panel" : undefined}
        aria-label={open && !minimized ? "Portfolio guide is open" : "Open portfolio guide"}
        whileHover={{ y: -4, scale: 1.035 }}
        whileTap={{ scale: 0.94 }}
      >
        <span className="portfolio-chat__launcher-orbit" aria-hidden="true" />
        <span className="portfolio-chat__launcher-glow" aria-hidden="true" />
        <FiMessageCircle aria-hidden="true" />
        <span>{open && minimized ? "Resume chat" : "Ask about my work"}</span>
      </motion.button>
    </aside>
  );
}
