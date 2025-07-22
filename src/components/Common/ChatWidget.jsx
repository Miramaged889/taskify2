import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "../../utils/translations";
import { Bot, X } from "lucide-react";
const ChatWidget = () => {
  const { language } = useSelector((state) => state.settings);
  const { t } = useTranslation(language);
  const isRTL = language === "ar";
  const [messages, setMessages] = useState([
    { from: "bot", text: t("welcomeBot") },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  };

  // Position chat widget left for Arabic, right for English
  const positionStyle = isRTL
    ? { position: "fixed", bottom: 24, left: 24, zIndex: 1000 }
    : { position: "fixed", bottom: 24, right: 24, zIndex: 1000 };

  return (
    <div style={positionStyle}>
      {open ? (
        <div className="w-80 bg-primary-500  shadow-lg rounded-lg flex flex-col h-96 border border-gray-200 dark:border-neutral-700">
          <div className="text-white px-4 py-2 rounded-t-lg flex justify-between items-center">
            <span className="font-semibold">{t("chat")}</span>
            <button
              onClick={() => setOpen(false)}
              className="text-white hover:text-gray-200"
              style={{ fontSize: 22 }}
            >
              <X size={28} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-gray-50 dark:bg-neutral-800">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.from === "user"
                    ? isRTL
                      ? "justify-start"
                      : "justify-end"
                    : isRTL
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs text-sm shadow-sm ${
                    msg.from === "user"
                      ? "text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-neutral-700 dark:text-gray-200"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSend}
            className="p-2 border-t border-gray-200 dark:border-neutral-700 flex gap-2 bg-white dark:bg-neutral-900"
          >
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-neutral-700 focus:outline-none focus:ring focus:border-blue-400 dark:bg-neutral-800 dark:text-white text-sm"
              placeholder={t("typeMessage")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={isRTL ? { direction: "rtl" } : { direction: "ltr" }}
            />
            <button
              type="submit"
              className="text-white px-4 bg-primary-500 py-2 rounded hover:opacity-90 text-sm"
            >
              {t("send")}
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="text-white bg-primary-500 rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-2xl hover:opacity-90 focus:outline-none border border-gray-200 dark:border-neutral-700"
          aria-label="Open chat"
          style={{ color: "#fff" }}
        >
          <Bot size={28} />
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
