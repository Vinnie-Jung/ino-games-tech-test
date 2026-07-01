# Winning Combinations - Payline Detection System

Implementation challenge for a payline verification system for slot machine games.

## 📁 Project Overview

This project implements a payline detection system for slot machine games. You are responsible for developing the functionality that checks whether a pay line has occurred in a slot machine.

## 🎰 Game Mechanics

### What is a Pay Line?

A pay line is a combination of symbols that results in a win on a slot machine. The original slot machines only had one pay line, which would pay if three matching symbols created a horizontal line.

### Symbol Rules

- **Wild Symbol:** `0` - Forms a pay line with any other paying symbol
- **Paying Symbols:** `[1, 2, 3, 4, 5, 6, 7, 8, 9]` - These symbols can create winning combinations
- **Non-Paying Symbols:** `[10, 11, 12, 13, 14, 15]` - These symbols do not contribute to pay lines

### Input/Output Format

**Input:** Array of numbers with 5 or 6 positions containing game symbols

**Output:** Array of winning combinations, where each combination is `[symbol, positions]`
- `symbol`: The winning symbol number
- `positions`: Array of 0-indexed positions where the combination occurs

## 💻 Implementation Details

### Core Function

```typescript
function call(lines: number[]): WinningCombinationsResult {
  // Implementation needed
  return [];
}

type WinningCombinationsResult = [number, number[]][];
```

### Example Cases

#### Basic Winning Combination
- **Input:** `[1, 2, 6, 6, 6]`
- **Output:** `[[6, [2, 3, 4]]]`
- **Explanation:** Three consecutive 6s at positions 2, 3, and 4

#### Wild Symbol Example
- **Input:** `[1, 2, 0, 2, 3]`
- **Output:** `[[2, [1, 2, 3]]]`
- **Explanation:** Wild symbol (0) at position 2 forms a pay line with the 2s

#### Multiple Combinations
- **Input:** `[3, 3, 3, 8, 8, 8]`
- **Output:** `[[3, [0, 1, 2]], [8, [3, 4, 5]]]`
- **Explanation:** Two separate winning combinations

#### No Winning Combinations
- **Input:** `[1, 6, 6, 7, 2, 3]`
- **Output:** `[]`
- **Explanation:** No three or more consecutive matching symbols

## 🧪 Automated Tests

### Test Coverage

The project includes **28 comprehensive test cases** covering:

1. **No winning combinations scenarios**
2. **Basic 3-symbol combinations**
3. **4+ symbol combinations**
4. **Wild symbol interactions**
5. **Multiple simultaneous combinations**
6. **Edge cases and boundary conditions**

### Key Test Cases

```typescript
// No combinations
[[1, 6, 6, 7, 2, 3], []]
[[9, 9, 5, 9, 9], []] // Non-consecutive

// Basic combinations
[[1, 2, 6, 6, 6], [[6, [2, 3, 4]]]]
[[3, 3, 3, 8, 6, 3], [[3, [0, 1, 2]]]]

// Wild symbol cases
[[1, 2, 0, 0, 3, 3], [[2, [1, 2, 3]], [3, [2, 3, 4, 5]]]]
[[0, 0, 0, 0, 0], [[0, [0, 1, 2, 3, 4]]]] // All wilds

// Extended combinations
[[3, 4, 3, 3, 3, 3], [[3, [2, 3, 4, 5]]]] // 4 symbols
```

### Test Configuration

- **Framework:** Vitest
- **Language:** TypeScript  
- **Configuration:** `../vitest.config.js` (project root)
- **TypeScript Config:** `../tsconfig.json` (global configuration)
- **Dependencies:** `../package.json` (centralized management)
- **Compilation:** Native TypeScript support

## 🚀 How to Run

### Setup and Installation

```bash
# Install dependencies (from project root)
npm install
```

### Running Tests

```bash
# Run all tests (from project root)
npm test

# Run only Winning Combinations tests
npm run test:winning

# Run tests in watch mode
npm run test:watch
```

#### Available Test Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all project tests (includes this project) |
| `npm run test:winning` | Run only this project's tests |
| `npm run test:watch` | Run tests in watch mode with auto-reload |

## ✅ Requirements

### What You Need to Deliver

1. **Complete Implementation:** Implement the `call` function in `winning-combinations.ts`
2. **Pass All Tests:** All 28 test cases must pass successfully
3. **Handle All Scenarios:** Support various input lengths (5-6 positions), wild symbols, and edge cases
4. **Clean Code:** Well-structured and readable implementation

### Success Criteria

- [ ] Function correctly identifies all winning combinations
- [ ] Wild symbol logic works properly (substitutes paying symbols only)
- [ ] Handles consecutive symbol detection accurately
- [ ] Returns correct position arrays for each combination
- [ ] All 28 test cases pass without errors
- [ ] Code is clean and maintainable

### Current Status

⚠️ **Implementation Pending:** The `call` function currently returns a fixed value `[[6, [2, 3, 4]]]` and needs proper implementation.

### Implementation Guidelines

1. **Parse Input:** Process the input array to identify symbols
2. **Detect Patterns:** Find consecutive sequences of 3+ matching symbols
3. **Handle Wilds:** Treat wild symbols (0) as matching any paying symbol
4. **Calculate Positions:** Track 0-indexed positions of winning combinations
5. **Return Results:** Format output as array of `[symbol, positions]` tuples

## 📋 File Structure

```
Winning Combinations/
├── tests/
│   └── winning-combinations.test.ts # Test suite (28 test cases)
├── winning-combinations.ts          # Main implementation file
└── README.md                        # This documentation
```

## 📞 Support

Good luck with the implementation! If you have any questions or face blocking issues that stop your progress, please contact us.

### Tips for Success

- Start by understanding the test cases to grasp expected behavior
- Handle wild symbols carefully (they only substitute paying symbols)
- Consider edge cases like all wilds, no combinations, and boundary positions
- Test incrementally as you build the logic
