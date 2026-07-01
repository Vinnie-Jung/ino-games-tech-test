type WinningCombinationsResult = [number, number[]][];

/**
 * Evaluates a single slot machine line and returns all winning symbol combinations.
 *
 * The function scans for consecutive runs of matching symbols, where:
 * - Paying symbols: 1–9
 * - Non-paying symbols: 10–15 (ignored)
 * - Wild symbol: 0 (substitutes for any paying symbol)
 *
 * Wildcard rules:
 * - A wild-only run (e.g., [0,0,0]) is valid only if it is not fully contained
 *   within a paying combination that utilizes wilds.
 * - This prevents duplicate combinations where wilds are already accounted for
 *   by the paying symbol.
 *
 * @param lines - Array of numbers representing a single slot machine payline.
 * @returns A sorted array of tuples, each containing [winningSymbol, positionsArray].
 */
function call(lines: number[]): WinningCombinationsResult {
  // --------------------------------------------------------------------------
  // PHASE 1: SCAN FOR ALL POSSIBLE RUNS
  // --------------------------------------------------------------------------

  const allDetectedCombinations: WinningCombinationsResult = [];

  // Iterate over all possible symbols (0 = wild, 1..9 = paying)
  for (let targetSymbol = 0; targetSymbol <= 9; targetSymbol++) {
    let currentIndex = 0;

    while (currentIndex < lines.length) {
      // Determines if the current position matches the targetSymbol.
      // - Wild (0) matches only itself.
      // - Paying symbols match either themselves OR a wild (0).
      const isCompatible = targetSymbol === 0
        ? lines[currentIndex] === 0
        : lines[currentIndex] === targetSymbol || lines[currentIndex] === 0;

      if (isCompatible) {
        const runStart = currentIndex;
        let containsRealSymbol = targetSymbol !== 0 && lines[currentIndex] === targetSymbol;

        // Extend the run as far as possible while maintaining compatibility
        while (
          currentIndex < lines.length &&
          (targetSymbol === 0
            ? lines[currentIndex] === 0
            : lines[currentIndex] === targetSymbol || lines[currentIndex] === 0)
        ) {
          if (targetSymbol !== 0 && lines[currentIndex] === targetSymbol) {
            containsRealSymbol = true;
          }
          currentIndex++;
        }

        // Build the list of position indices for this run
        const positionIndices: number[] = [];
        for (let j = runStart; j < currentIndex; j++) {
          positionIndices.push(j);
        }

        // Run validation:
        // - Must have a length of at least 3.
        // - For paying symbols, the run must include at least one actual (non-wild) occurrence.
        // - For wild (0), any length >= 3 is valid.
        if (positionIndices.length >= 3 && (targetSymbol === 0 || containsRealSymbol)) {
          allDetectedCombinations.push([targetSymbol, positionIndices]);
        }
      } else {
        currentIndex++;
      }
    }
  }

  // --------------------------------------------------------------------------
  // PHASE 2: POST-PROCESSING - RESOLVE OVERLAPPING WILD COMBINATIONS
  // --------------------------------------------------------------------------

  // Separate paying symbol runs from wild-only runs
  const payingCombos = allDetectedCombinations.filter(([symbol]) => symbol !== 0);
  const wildCombos = allDetectedCombinations.filter(([symbol]) => symbol === 0);

  /**
   * Wild suppression rule:
   * Remove any wild-only combination that is entirely contained within a
   * paying combination that leverages wildcards.
   *
   * Example: In [0,0,0,3,3,3], the wild run [0,1,2] is contained within
   * the '3' run [0,1,2,3,4,5]. Since '3' already accounts for those wilds,
   * the isolated wild run is suppressed to avoid duplication.
   */
  const remainingWildCombos = wildCombos.filter(([, wildPositions]) => {
    const wildStart = wildPositions[0];
    const wildEnd = wildPositions[wildPositions.length - 1];

    return !payingCombos.some(([, payingPositions]) => {
      // Check if this paying combination actually utilizes any wild symbol
      const includesWildcard = payingPositions.some((index) => lines[index] === 0);
      if (!includesWildcard) return false;

      const payingStart = payingPositions[0];
      const payingEnd = payingPositions[payingPositions.length - 1];

      // Full containment check: paying combo completely wraps the wild combo
      return payingStart <= wildStart && payingEnd >= wildEnd;
    });
  });

  // --------------------------------------------------------------------------
  // PHASE 3: FINAL ASSEMBLY AND SORTING
  // --------------------------------------------------------------------------

  // Merge all valid paying combinations with the filtered wild combinations
  const finalResult = [...payingCombos, ...remainingWildCombos];

  // Sort ascending by the starting position of each combination
  // This guarantees deterministic output that matches test expectations
  finalResult.sort((a, b) => a[1][0] - b[1][0]);

  return finalResult;
}

export const WinningCombinations = { call };