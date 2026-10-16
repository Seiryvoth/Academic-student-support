'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexRendererProps {
  content: string;
  className?: string;
  inline?: boolean;
}

interface Segment {
  type: 'text' | 'inline-math' | 'block-math';
  content: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({
  content,
  className = '',
  inline = false,
}) => {
  const segments = useMemo(() => {
    if (!content || typeof content !== 'string') return [];

    const result: Segment[] = [];
    let remaining = content;

    // Regex to detect $$block$$ and $inline$
    // Note: $$ takes precedence over $
    const pattern = /(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(content)) !== null) {
      const matchIndex = match.index;
      const matchedStr = match[0];

      // Add preceding plain text if any
      if (matchIndex > lastIndex) {
        result.push({
          type: 'text',
          content: content.slice(lastIndex, matchIndex),
        });
      }

      // Check if block math ($$...$$) or inline ($...$)
      if (matchedStr.startsWith('$$') && matchedStr.endsWith('$$')) {
        result.push({
          type: 'block-math',
          content: matchedStr.slice(2, -2).trim(),
        });
      } else if (matchedStr.startsWith('$') && matchedStr.endsWith('$')) {
        result.push({
          type: 'inline-math',
          content: matchedStr.slice(1, -1).trim(),
        });
      }

      lastIndex = matchIndex + matchedStr.length;
    }

    // Add trailing text
    if (lastIndex < content.length) {
      result.push({
        type: 'text',
        content: content.slice(lastIndex),
      });
    }

    return result;
  }, [content]);

  return (
    <span className={`inline-block max-w-full ${className}`}>
      {segments.map((seg, idx) => {
        if (seg.type === 'text') {
          return <span key={idx}>{seg.content}</span>;
        }

        const isBlock = seg.type === 'block-math' && !inline;
        let renderedHtml = '';

        try {
          renderedHtml = katex.renderToString(seg.content, {
            displayMode: isBlock,
            throwOnError: false,
            output: 'htmlAndMathml',
          });
        } catch {
          renderedHtml = `<code>${seg.content}</code>`;
        }

        if (isBlock) {
          return (
            <span
              key={idx}
              className="block my-2 overflow-x-auto py-1 px-2 text-center"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          );
        }

        return (
          <span
            key={idx}
            className="inline-math mx-0.5"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        );
      })}
    </span>
  );
};

export default LatexRenderer;
