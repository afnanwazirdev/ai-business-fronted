import React, { useState, useRef, useEffect } from 'react';
import {
  FiSend,
  FiTrash2,
  FiPlus,
  FiMessageSquare,
  FiZap,
  FiCpu,
  FiShield,
  FiCheckCircle,
} from 'react-icons/fi';
import { streamAssistantMessage } from '../../services/assistantService';
import PageHeader from '../../components/layout/PageHeader/PageHeader';
import ChatMessage from '../../components/assistant/ChatMessage/ChatMessage';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

export const AssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Assalam-o-Alaikum! Main aapka KarobarAI Munshi hoon. Main aapke orders, stock, customers aur COD cash ka live hisaab rakhta hoon. Aap mujhse Roman Urdu, Urdu ya English mein pooch sakte hain.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [conversations, setConversations] = useState([
    { id: 'c1', title: 'Aaj ka Hisaab & Sales' },
    { id: 'c2', title: 'Low Stock Restock Plan' },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const handleSend = async (queryText) => {
    const text = queryText || inputVal;
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setStreamingMessage({ role: 'assistant', content: '', toolCalls: [] });

    let fullText = '';
    const collectedTools = [];

    await streamAssistantMessage({
      message: text,
      onChunk: (chunk) => {
        fullText += chunk;
        setStreamingMessage((prev) => ({ ...prev, content: fullText }));
      },
      onToolCall: (tc) => {
        setActiveTool(tc.name);
      },
      onToolResult: (tr) => {
        collectedTools.push({ toolName: tr.name, toolResult: tr.result });
        setStreamingMessage((prev) => ({ ...prev, toolCalls: [...collectedTools] }));
        setActiveTool(null);
      },
      onDone: () => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: fullText,
            toolCalls: collectedTools,
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

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat clear ho gaya hai. Aap mujhse naya sawaal pooch sakte hain.',
      },
    ]);
  };

  const quickPrompts = [
    { label: 'Aaj ki Sales', prompt: 'Aaj ki total sales aur naye orders kitne hain?' },
    { label: 'Kam Stock Maal', prompt: 'Konsay products ka stock alert level se kam ho gaya hai?' },
    { label: 'Pending COD Cash', prompt: 'Pending COD parcels ka kitna cash delivery riders ke pas hai?' },
    { label: 'Best Selling Items', prompt: 'Pichlay 30 dinon mein konsa product sab se zyada bika?' },
    { label: 'WhatsApp Draft', prompt: 'Order KB-1001 ke customer ke liye WhatsApp confirmation message draft karein.' },
  ];

  return (
    <div>
      <PageHeader
        title="AI Assistant (Munshi AI)"
        subtitle="Claude-powered intelligent business assistant with live database tool access."
        breadcrumbs={[
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'AI Assistant' },
        ]}
        actions={
          <Button variant="secondary" iconLeft={<FiTrash2 />} onClick={handleClearChat}>
            Clear Chat
          </Button>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: '20px',
          height: 'calc(100vh - 210px)',
          minHeight: '560px',
        }}
      >
        {/* Left Side: Threads & System Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card padding="sm" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px', borderBottom: '1px solid var(--color-border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Conversations
              </span>
              <button
                type="button"
                onClick={handleClearChat}
                style={{ color: 'var(--color-brand-primary)', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <FiPlus size={12} /> New
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {conversations.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'var(--color-bg-subtle)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FiMessageSquare size={13} style={{ color: 'var(--color-text-muted)' }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Zero Hallucination Guarantee Badge */}
            <div
              style={{
                padding: '10px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                fontSize: '11px',
                color: 'var(--color-brand-secondary)',
                lineHeight: 1.4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, marginBottom: '2px' }}>
                <FiCheckCircle /> Zero Hallucination
              </div>
              All metrics come directly from verified MongoDB Mongoose queries.
            </div>
          </Card>
        </div>

        {/* Right Side: Main Chat Feed */}
        <Card
          padding="none"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Messages Scroll Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
            {messages.map((m, idx) => (
              <ChatMessage key={idx} message={m} />
            ))}

            {streamingMessage && (
              <ChatMessage message={streamingMessage} isStreaming />
            )}

            {activeTool && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 12px',
                  background: 'var(--color-brand-primary-subtle)',
                  border: '1px solid var(--color-brand-primary-border)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  color: 'var(--color-brand-primary)',
                  marginBottom: '12px',
                  width: 'fit-content',
                }}
              >
                <FiZap className="spin" />
                <span>Mongoose database query executing: <strong>{activeTool}</strong>...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestions */}
          <div
            style={{
              padding: '8px 16px',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              borderTop: '1px solid var(--color-border-subtle)',
              background: 'var(--color-bg-card)',
            }}
          >
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qp.prompt)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  background: 'var(--color-bg-subtle)',
                  border: '1px solid var(--color-border-default)',
                  fontSize: '11px',
                  color: 'var(--color-text-secondary)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '14px 16px',
              borderTop: '1px solid var(--color-border-subtle)',
              background: 'var(--color-bg-elevated)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Ask anything in Roman Urdu, Urdu ya English (e.g. 'Aaj ki sales kitni hain?')..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                flex: 1,
                height: '42px',
                padding: '0 14px',
                background: 'var(--color-bg-input)',
                border: '1px solid var(--color-border-default)',
                borderRadius: '8px',
                color: 'var(--color-text-primary)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputVal.trim() && !streamingMessage}
              iconRight={<FiSend />}
            >
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AssistantPage;
