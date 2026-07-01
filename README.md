# Slot Machine Algorithms — Technical Challenge

## Overview

This repository contains the implementation of two core slot machine algorithms:

1. **Column Cadence System** — controls the sequential stopping timing of reels, with an "anticipation" feature triggered by special symbols.
2. **Winning Combinations Detector** — identifies consecutive matching symbols on a payline, with wildcard (0) substitution and intelligent duplicate suppression.

Both solutions are fully tested and ready for production integration.

## Winning Combinations Detector

**Location:** <code>WinningCombinations/tests/winning-combinations.test.ts</code>

### Problem Statement
Given a single payline (array of integers), detect all winning combinations where:

- Paying symbols are <code>1</code> through <code>9</code>

- Non-paying symbols are <code>10</code> through <code>15</code> (ignored)

- Wild symbol is <code>0</code> (substitutes for any paying symbol)

- A valid combination requires **at least 3 consecutive matching symbols**

- Wildcard runs must not duplicate combinations already captured by paying symbols

### Solution Approach

**Phase 1: Run Detection**

For each possible symbol (0 through 9), scan the line left to right and identify contiguous runs of compatible positions.

```typescript

const isCompatible = targetSymbol === 0
  ? lines[currentIndex] === 0
  : lines[currentIndex] === targetSymbol || lines[currentIndex] === 0;

```

Wild (<code>0</code>) matches only itself

Paying symbol (<code>n</code>) matches itself OR a wild (<code>0</code>)

Each run is validated:

- Minimum length of 3

- For paying symbols, the run must contain at least one actual (non-wild) instance of that symbol

**Phase 2: Wild Duplicate Suppression**

This was the critical insight. Without post-processing, wild-only runs would incorrectly appear alongside paying combinations that already incorporate those wilds.

**Example:** <code>[0, 0, 0, 3, 3, 3]</code>

Paying <code>3</code> run covers positions <code>[0..5]</code> (using wilds at <code>0..2</code>)

Wild-only run covers <code>[0..2]</code> (as <code>[0,0,0]</code>)

If we kept both, we'd get duplicate combinations. The suppression rule removes any wild-only run that is fully contained within a paying combination that actually uses wildcards.

```typescript

const remainingWildCombos = wildCombos.filter(([, wildPositions]) => {
  const wildStart = wildPositions[0];
  const wildEnd = wildPositions[wildPositions.length - 1];

  return !payingCombos.some(([, payingPositions]) => {
    const includesWildcard = payingPositions.some(idx => lines[idx] === 0);
    if (!includesWildcard) return false;

    const payingStart = payingPositions[0];
    const payingEnd = payingPositions[payingPositions.length - 1];

    return payingStart <= wildStart && payingEnd >= wildEnd;
  });
});

```

**Phase 3: Sorting and Assembly**

All valid combinations (paying + surviving wild) are merged and sorted ascending by their start position. This guarantees deterministic output that matches test expectations.

## Edge Cases Handled

<div align="center">

| Scenario                                    | Example                    | Expected                         |
| :------------------------------------------ | :------------------------: | :--------------------------------------------------------: |
| Wilds on both sides of paying symbol        | <code>[0,0,0,3,3,3]</code> | <code>[[3, [0.1.2.3.4.5]]]</code>                          |
| Wilds only at beginning                     | <code>[0,0,0,0,0,8]</code> | <code>[[8, [0,1,2,4]]]</code>                              |
| Wilds only at end                           | <code>[8,0,0,0,0,0]</code> | <code>[[8, [0,1,2,3,4]]]</code>                            |
| All wilds                | 0                | <code>[0,0,0,0,0,0]</code> | <code>[[0, [0,1,2,3,4]]]</code>                            |
| Wilds bridging two different paying symbols | <code>[1,1,0,0,3,3]</code> | <code>[[1, [0,1,2,3]]</code>, <code>[3, [2,3,4,5]]]</code> |

</div>

All 28 test cases pass successfully.

## Column Cadence System

**Location:** <code>Cadence/SlotMachineCadence.ts</code>

### Problem Statement

A slot machine with configurable columns must stop each reel sequentially. The time interval between each column stop is determined by a cadence value. When special symbols appear, the cadence changes to create an "anticipation" effect, slowing down the reels to build player excitement.

**Key constraints:**

- Default cadence: <code>1</code> (fast stop)

- Anticipation cadence: <code>2</code> (slow stop)

- Anticipation triggers when the cumulative count of special symbols falls within [minToAnticipate, maxToAnticipate)

- Special symbols are counted progressively as we move from left to right

### Solution Approach

**1. Symbol Counting per Column**

```javascript

const columnCounts = new Array(columnSize).fill(0);
  for (const sym of symbols) {
    if (sym.column >= 0 && sym.column < columnSize) {
      columnCounts[sym.column]++;
    }
}

```

We pre-compute the number of special symbols in each column to allow O(1) lookups during the main loop.

**2. Progressive Accumulation**

The algorithm maintains an <code>accumulated</code> counter that grows as we traverse columns from left to right. This is crucial because anticipation depends on cumulative special symbols seen so far, not just the current column.

**3. Cadence Decision Logic**

```typescript

const isAnticipating = accumulated >= minToAnticipate && accumulated < maxToAnticipate;
const cadence = isAnticipating ? anticipateCadence : defaultCadence;

```
The cadence applied to the **interval after** the current column is determined by the accumulated count **including** the current column's symbols. This matches the reference scenario where anticipation starts as soon as the minimum threshold is reached.

**4. Time Accumulation**

Each column's stop time is recorded **before** consuming its special symbols and updating the cadence. This ensures that a column's own symbols do not affect its own stop time (they affect the **next** column's interval).

### Example Walkthrough

Given: <code>columnSize = 6</code>, <code>minToAnticipate = 1</code>, <code>maxToAnticipate = 2</code>, special symbols at columns <code>[1, 4]</code>

<div align="center">

**Table showing the example**


| Column           | Symbols          | Accumulated      | Anticipating?    | Cadence          | Stop Time        |
| :--------------: | :--------------: | :--------------: | :--------------: | :--------------: | :--------------: |
| 0                | 0                | 0                | No               | 1                | 0                |
| 1                | 1                | 1                | Yes              | 2                | 1                |
| 2                | 0                | 1                | Yes              | 2                | 3                |
| 3                | 0                | 1                | Yes              | 2                | 5                |
| 4                | 1                | 2                | No (max reached) | 1                | 7                |
| 5                | 0                | 2                | No               | 1                | 8                |


</div>

Result: <code>[0, 1, 3, 5, 7, 8]</code>

## Key Technical Decisions

### 1. Progressive vs. Total Counting (Cadence)


Used progressive accumulation rather than a simple total count because anticipation is triggered based on cumulative symbols seen so far. A column's symbols affect the cadence of subsequent columns, not itself.

### 2. Wild Suppression Post-Processing (Winning Combinations)

Instead of trying to handle wild overlap during the initial scan (which would have been complex and error-prone), a two-phase approach was adopted:

- **Phase 1**: Collect everything

- **Phase 2**: Filter out duplicates using a precise containment check

This made the code more maintainable and easier to reason about.

### 3. Naming Conventions

Used self-documenting variable names throughout:

- <code>columnCounts</code> instead of <code>counts</code>

- <code>accumulated</code> instead of <code>acc</code>

- <code>containsRealSymbol</code> instead of <code>hasReal</code>

- <code>payingCombos</code> / <code>remainingWildCombos</code> for clarity

### 4. Immutability

Avoided mutating original arrays by using the spread operator (...) to create new arrays before sorting. This prevents side effects and makes the code more predictable.

### 5. Cross-Platform Test Script Compatibility

The `test:winning` script was adjusted to use a **direct file path** (`WinningCombinations/tests/winning-combinations.test.ts`) instead of a glob pattern with `**` (`WinningCombinations/**/*.test.ts`). This decision was made to ensure consistent execution across different environments:

- **Windows (Git Bash / PowerShell):** Glob expansion with `**` and spaces can be unreliable, often failing to locate test files.
- **Unix / Linux / macOS:** Globs work as expected, but using a direct path eliminates any ambiguity and works universally.

By specifying the exact test file, we guarantee that the command runs without errors on any developer machine, reducing friction during local development and CI/CD pipelines.

## Test Results

### Cadence System

Tested with 3 different game rounds covering:

- Multiple symbols across columns

- Minimum threshold (exactly 2 symbols in same column)

- Edge case with symbols only in last column

All scenarios produce expected cadence arrays.

### Winning Combinations

28 unit tests covering:

- No combinations

- Basic 3-symbol runs

- Multiple combinations

- Wildcard substitution

- Wildcard suppression edge cases

All tests passing.

## Author

This solution was developed as part of a technical assessment for **Ino Games**.
For any questions or feedback, please reach out via [LinkedIn](https://www.linkedin.com/in/vinicius-jung/?locale=en) or [e-mail](mailto:viniciusjung@outlook.com).
