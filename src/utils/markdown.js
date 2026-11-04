/**
 * NOVA — Safe Markdown & Code Formatter
 * Sanitizes input and renders structured chat formatting safely (prevents XSS).
 */

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderMarkdown(rawText) {
  if (!rawText) return '';

  // Extract and preserve code blocks (both completed and in-progress streaming blocks)
  const codeBlocks = [];
  let processed = rawText.replace(/```([a-zA-Z0-9_\-#+.]*)\r?\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push({
      lang: lang.trim() || 'plaintext',
      code: code.trimEnd()
    });
    return placeholder;
  });

  // Handle in-progress streaming code block before closing ticks arrive
  processed = processed.replace(/```([a-zA-Z0-9_\-#+.]*)\r?\n([\s\S]*?)$/g, (match, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    codeBlocks.push({
      lang: lang.trim() || 'plaintext',
      code: code.trimEnd()
    });
    return placeholder;
  });

  // Escape all other HTML
  processed = escapeHtml(processed);

  // Inline formatting
  // Bold
  processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Italic
  processed = processed.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em>$2</em>$3');
  // Inline code
  processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Blockquotes
  processed = processed.replace(/(^|\n)&gt; (.*?)(?=\n|$)/g, '$1<blockquote>$2</blockquote>');

  // Split into lines for lists and paragraphs
  const lines = processed.split('\n');
  const outputLines = [];
  let inUl = false;
  let inOl = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check unordered list item
    const ulMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!inUl) {
        if (inOl) { outputLines.push('</ol>'); inOl = false; }
        outputLines.push('<ul>');
        inUl = true;
      }
      outputLines.push(`<li>${ulMatch[2]}</li>`);
      continue;
    }

    // Check ordered list item
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!inOl) {
        if (inUl) { outputLines.push('</ul>'); inUl = false; }
        outputLines.push('<ol>');
        inOl = true;
      }
      outputLines.push(`<li>${olMatch[2]}</li>`);
      continue;
    }

    // Close any open lists
    if (inUl) { outputLines.push('</ul>'); inUl = false; }
    if (inOl) { outputLines.push('</ol>'); inOl = false; }

    // If blank line, skip or wrap
    if (!line.trim()) {
      continue;
    }

    // If it's a code block placeholder, leave as is
    if (line.includes('__CODE_BLOCK_')) {
      outputLines.push(line);
      continue;
    }

    // Regular paragraph
    outputLines.push(`<p>${line}</p>`);
  }

  if (inUl) outputLines.push('</ul>');
  if (inOl) outputLines.push('</ol>');

  let result = outputLines.join('\n');

  // Re-insert safe code blocks with copy button
  for (let i = 0; i < codeBlocks.length; i++) {
    const block = codeBlocks[i];
    const escapedCode = escapeHtml(block.code);
    const codeId = `code_${Date.now()}_${i}`;

    const blockHtml = `
      <div class="code-block-wrapper">
        <div class="code-block-header">
          <span class="code-lang-label">${escapeHtml(block.lang)}</span>
          <button class="copy-code-btn" data-code-target="${codeId}" title="Copy code">
            <svg class="copy-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            <span class="copy-text">Copy</span>
          </button>
        </div>
        <pre><code id="${codeId}">${escapedCode}</code></pre>
      </div>
    `.trim();

    result = result.replace(`__CODE_BLOCK_${i}__`, blockHtml);
  }

  return result;
}

