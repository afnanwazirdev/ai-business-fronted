// SSE Streaming Assistant Service
export const streamAssistantMessage = async ({
  message,
  conversationId,
  onChunk,
  onToolCall,
  onToolResult,
  onDone,
  onError,
}) => {
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ message, conversationId }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || `HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || ''; // retain incomplete chunk in buffer

      for (const line of lines) {
        if (!line.trim()) continue;

        let event = 'message';
        let dataStr = '';

        const eventMatch = line.match(/^event:\s*(.+)$/m);
        if (eventMatch) event = eventMatch[1].trim();

        const dataMatch = line.match(/^data:\s*(.+)$/m);
        if (dataMatch) dataStr = dataMatch[1].trim();

        if (dataStr) {
          try {
            const parsed = JSON.parse(dataStr);
            if (event === 'chunk' && onChunk) {
              onChunk(parsed.text || '');
            } else if (event === 'tool_call' && onToolCall) {
              onToolCall(parsed);
            } else if (event === 'tool_result' && onToolResult) {
              onToolResult(parsed);
            } else if (event === 'done' && onDone) {
              onDone(parsed);
            } else if (event === 'error' && onError) {
              onError(new Error(parsed.message || 'Error occurred'));
            }
          } catch {
            // raw string data
            if (event === 'chunk' && onChunk) onChunk(dataStr);
          }
        }
      }
    }
  } catch (error) {
    if (onError) onError(error);
  }
};
