/**
 * Parses raw input text into separate word and punctuation token objects.
 * 
 * @param {string} text - The input sentence/text
 * @returns {Array<object>} - Array of token objects
 */
export const convertRawTextToTokens = (text) => {
  if (!text) {
    return [];
  }

  const regex = /(\w+)/g;
  let match;
  let lastIndex = 0;
  const tokens = [];

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: text.substring(lastIndex, match.index),
        isWord: false,
        startIndex: lastIndex,
        endIndex: match.index
      });
    }
    tokens.push({
      text: match[0],
      isWord: true,
      startIndex: match.index,
      endIndex: regex.lastIndex
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({
      text: text.substring(lastIndex),
      isWord: false,
      startIndex: lastIndex,
      endIndex: text.length
    });
  }

  return tokens;
};
