/**
 * Parse text into word and non-word tokens
 * @param {string} text - The input sentence/text
 * @returns {Array<object>} - Array of token objects
 */
export const parseTextToTokens = (text) => {
  if (!text) return [];

  const regex = /(\w+)/g;
  let match;
  let lastIndex = 0;
  const newTokens = [];

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      newTokens.push({
        text: text.substring(lastIndex, match.index),
        isWord: false,
        startIndex: lastIndex,
        endIndex: match.index
      });
    }
    newTokens.push({
      text: match[0],
      isWord: true,
      startIndex: match.index,
      endIndex: regex.lastIndex
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    newTokens.push({
      text: text.substring(lastIndex),
      isWord: false,
      startIndex: lastIndex,
      endIndex: text.length
    });
  }

  return newTokens;
};
