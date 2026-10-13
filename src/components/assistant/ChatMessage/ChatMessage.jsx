import React, { useState } from 'react';
import { FiUser, FiZap, FiCopy, FiCheck, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import RichToolCard from '../RichToolCard/RichToolCard';
import styles from './ChatMessage.module.css';

export const ChatMessage = ({
  message,
  isStreaming = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState('none'); // 'up' | 'down' | 'none'

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Detect Urdu script for RTL styling
  const isUrdu = /[\u0600-\u06FF]/.test(message.content);

  return (
    <div className={`${styles.messageRow} ${isUser ? styles.userRow : ''}`}>
      <div className={`${styles.avatar} ${isUser ? styles.userAvatar : styles.assistantAvatar}`}>
        {isUser ? <FiUser /> : <FiZap />}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '82%' }}>
        <div
          className={`
            ${styles.bubble}
            ${isUser ? styles.userBubble : styles.assistantBubble}
            ${isUrdu ? 'lang-ur' : ''}
          `}
          style={{ maxWidth: '100%' }}
        >
          {message.content ? (
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
              {isStreaming && <span className={styles.caret} />}
            </div>
          ) : (
            isStreaming && (
              <div className={styles.typingIndicator}>
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
              </div>
            )
          )}

          {/* Render Rich Tool Results if present */}
          {message.toolCalls && message.toolCalls.map((tc, idx) => (
            <RichToolCard
              key={idx}
              toolName={tc.toolName}
              result={tc.toolResult}
            />
          ))}
        </div>

        {/* Message Actions (Copy & Thumbs Up/Down) for Assistant */}
        {!isUser && !isStreaming && message.content && (
          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handleCopy}
              aria-label="Copy response"
            >
              {copied ? <FiCheck size={12} color="var(--color-brand-secondary)" /> : <FiCopy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              className={`${styles.actionBtn} ${feedback === 'up' ? styles.activeFeedback : ''}`}
              onClick={() => setFeedback(feedback === 'up' ? 'none' : 'up')}
              aria-label="Helpful"
            >
              <FiThumbsUp size={12} />
            </button>

            <button
              type="button"
              className={`${styles.actionBtn} ${feedback === 'down' ? styles.activeFeedback : ''}`}
              onClick={() => setFeedback(feedback === 'down' ? 'none' : 'down')}
              aria-label="Not helpful"
            >
              <FiThumbsDown size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
