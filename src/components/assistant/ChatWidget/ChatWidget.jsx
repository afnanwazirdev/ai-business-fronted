import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiMaximize2, FiTrash2, FiZap, FiMessageCircle } from 'react-icons/fi';
import { streamAssistantMessage } from '../../../services/assistantService';
import ChatMessage from '../ChatMessage/ChatMessage';
import styles from './ChatWidget.module.css';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Assalam-o-Alaikum! Main KarobarAI Munshi hoon. Aaj ki sales, pending COD orders, ya low stock ke baray mein poochein.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [activeTool, setActiveTool] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, streamingMessage, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setStreamingMessage({ role: 'assistant', content: '', toolCalls: [] });

    let currentResponse = '';
    const collectedToolCalls = [];

    await streamAssistantMessage({
      message: query,
      onChunk: (chunk) => {
        currentResponse += chunk;
        setStreamingMessage((prev) => ({
          ...prev,
          content: currentResponse,
        }));
      },
      onToolCall: (tc) => {
        setActiveTool(tc.name);
      },
      onToolResult: (tr) => {
        collectedToolCalls.push({ toolName: tr.name, toolResult: tr.result });
        setStreamingMessage((prev) => ({
          ...prev,
          toolCalls: [...collectedToolCalls],
        }));
        setActiveTool(null);
      },
      onDone: () => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: currentResponse,
            toolCalls: collectedToolCalls,
          },
        ]);
        setStreamingMessage(null);
      },
      onError: (err) => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `Maazrat! Error: ${err.message}`,
          },
        ]);
        setStreamingMessage(null);
        setActiveTool(null);
      },
    });
  };

  const suggestionChips = [
    'Aaj ki sales kitni hain?',
    'Low stock maal dikhao',
    'Pending COD orders',
    'Top selling products',
  ];

  return (
    <div className={styles.widgetWrapper}>
      {/* Floating Trigger Button */}
      <button
        type="button"
        className={styles.floatingTrigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <span style={{ fontSize: '20px' }}>✕</span> : <FiMessageCircle />}
      </button>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className={styles.chatPanel}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.aiBadge}><FiMessageCircle size={14} /></div>
              <div>
                <div className={styles.headerTitle}>KarobarAI Munshi</div>
                <div className={styles.headerStatus}>● Live Database Connected</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{ color: 'var(--color-text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              ✕
            </button>
          </div>

          <div className={styles.messagesList}>
            {messages.map((m, idx) => (
              <ChatMessage key={idx} message={m} />
            ))}

            {streamingMessage && (
              <ChatMessage message={streamingMessage} isStreaming />
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className={styles.chipsRow}>
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                className={styles.chip}
                onClick={() => handleSendMessage(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            className={styles.inputForm}
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className={styles.inputField}
              placeholder="Urdu, Roman Urdu ya English mein poochein..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button
              type="submit"
              className={styles.sendBtn}
              disabled={!inputVal.trim()}
              aria-label="Send"
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
