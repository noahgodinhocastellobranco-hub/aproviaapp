import React from "react";

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Renders text with markdown bold (**text**) converted to <strong> tags
 * and strips remaining asterisks. Also handles *italic* → <em>.
 */
export default function FormattedText({ text, className = "" }: FormattedTextProps) {
  if (!text) return null;

  // Convert **bold** to <strong>, then *italic* to <em>, then strip remaining *
  const parts: React.ReactNode[] = [];
  // Split by **bold** pattern first
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  const processItalicAndClean = (str: string): React.ReactNode[] => {
    const italicRegex = /\*([^*]+)\*/g;
    const result: React.ReactNode[] = [];
    let idx = 0;
    let m;

    while ((m = italicRegex.exec(str)) !== null) {
      if (m.index > idx) {
        result.push(str.slice(idx, m.index).replace(/\*/g, ""));
      }
      result.push(<em key={`i-${m.index}`}>{m[1]}</em>);
      idx = m.index + m[0].length;
    }

    if (idx < str.length) {
      result.push(str.slice(idx).replace(/\*/g, ""));
    }

    return result;
  };

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...processItalicAndClean(text.slice(lastIndex, match.index)));
    }
    parts.push(<strong key={`b-${match.index}`}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(...processItalicAndClean(text.slice(lastIndex)));
  }

  return <span className={className}>{parts}</span>;
}
