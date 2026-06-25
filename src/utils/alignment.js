/**
 * Align original list of words with spoken words using DP Needleman-Wunsch sequence alignment.
 * Eliminates nested branch structures with early continue/return guard clauses.
 * 
 * @param {Array<string>} originalWords - List of cleaned lowercase original words
 * @param {Array<string>} spokenWords - List of cleaned lowercase spoken words
 * @returns {Set<number>} - Set of matched original word indices
 */
export const alignOriginalAndSpokenWords = (originalWords, spokenWords) => {
  const n = originalWords.length;
  const m = spokenWords.length;
  
  if (n === 0 || m === 0) {
    return new Set();
  }

  // dp[i][j] stores the max score (exact matches)
  const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));
  const parent = Array(n + 1).fill(null).map(() => Array(m + 1).fill(null));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (originalWords[i - 1] === spokenWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        parent[i][j] = { i: i - 1, j: j - 1, type: 'match' };
        continue;
      }

      if (dp[i - 1][j] >= dp[i][j - 1]) {
        dp[i][j] = dp[i - 1][j];
        parent[i][j] = { i: i - 1, j, type: 'skip_original' };
        continue;
      }

      dp[i][j] = dp[i][j - 1];
      parent[i][j] = { i, j: j - 1, type: 'skip_spoken' };
    }
  }

  const matchedOriginalIndices = new Set();
  let currI = n;
  let currJ = m;

  while (currI > 0 && currJ > 0) {
    const p = parent[currI][currJ];
    if (!p) {
      break;
    }

    if (p.type === 'match') {
      matchedOriginalIndices.add(currI - 1);
      currI = p.i;
      currJ = p.j;
      continue;
    }

    if (p.type === 'skip_original') {
      currI = p.i;
      currJ = p.j;
      continue;
    }

    currJ = p.j;
  }

  return matchedOriginalIndices;
};
