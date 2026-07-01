# Cadence - Slot Machine Column Timing System

Implementation challenge for slot machine column cadence system with anticipation mechanics.

## 📁 Project Overview

This project implements a slot machine column timing system that controls when each column stops spinning. The system includes an "anticipation" feature where special symbols can modify the default stopping cadence.

## 🎰 Game Mechanics

### Slot Machine Configuration
- **Matrix Size:** 5 columns × 6 rows (configurable via `columnSize`)
- **Default Cadence:** 0.25 (normal stopping interval)
- **Anticipate Cadence:** 2 (modified stopping interval when anticipation is active)
- **Min Symbols for Anticipation:** 2 special symbols required to start anticipation
- **Max Symbols for Anticipation:** 3 special symbols to end anticipation

### How the Game Works

1. **Slot Machine Setup:** The game has a slot machine with configurable columns and rows (default: 5×6 matrix)
2. **Round Start:** Every new round, the machine spins all columns and receives a new set of symbols for each position
3. **Column Stopping:** When the machine stops spinning, each column stops with a specific cadence
4. **Special Symbols:** The game has special symbols that can appear and change the machine's column cadence
5. **Anticipation Mode:** Special symbols can trigger "Anticipation" which modifies the stopping cadence

### How Column Cadence Works

- Each column stops at its calculated time
- Stopping starts from the first column (time = 0)
- Subsequent columns add the cadence interval to the previous column's time
- **Normal Mode:** Uses `defaultCadence` value
- **Anticipation Mode:** Uses `anticipateCadence` value when criteria are met

## 💻 Implementation Details

### Data Structures

```typescript
type AnticipatorConfig = {
  columnSize: number;           // Number of columns in the slot machine
  minToAnticipate: number;     // Minimum special symbols to start anticipation
  maxToAnticipate: number;     // Maximum special symbols to end anticipation
  anticipateCadence: number;   // Cadence value during anticipation
  defaultCadence: number;      // Normal cadence value
};

type SlotCoordinate = {
  column: number;              // Column position (0-indexed)
  row: number;                 // Row position (0-indexed)
};

type SpecialSymbol = { 
  specialSymbols: Array<SlotCoordinate> 
};

type SlotCadence = Array<number>;  // Array of column stop times
```

### Current Configuration

```typescript
const anticipatorConfig: AnticipatorConfig = {
  columnSize: 5,
  minToAnticipate: 2,
  maxToAnticipate: 3,
  anticipateCadence: 2,
  defaultCadence: 0.25,
};
```

### Test Data

The implementation includes three game rounds with different special symbol configurations:

1. **Round One:** 3 special symbols at columns [0,1,3] - triggers anticipation
   - `{ column: 0, row: 2 }, { column: 1, row: 3 }, { column: 3, row: 4 }`

2. **Round Two:** 2 special symbols in same column [0] - at minimum threshold
   - `{ column: 0, row: 2 }, { column: 0, row: 3 }`

3. **Round Three:** 2 special symbols in last column [4] - edge case testing
   - `{ column: 4, row: 2 }, { column: 4, row: 3 }`

## 🔧 Functions to Implement

### `slotCadence(symbols: Array<SlotCoordinate>): SlotCadence`

**Purpose:** Core function that calculates column stop timing based on special symbol positions

**Parameters:**
- `symbols`: Array of coordinates representing special symbol positions

**Returns:** Array of numbers representing the slot machine stop cadence for each column

**Current Status:** ⚠️ Returns empty array - needs implementation

**Implementation Requirements:**
1. Count special symbols per column
2. Determine if anticipation should be active based on min/max thresholds
3. Calculate cumulative stop times using appropriate cadence values
4. Return array of stop times for all columns

### `handleCadences(rounds: RoundsSymbols): RoundsCadences`

**Purpose:** Processes all game rounds and returns cadences for each

**Status:** ✅ Already implemented - calls `slotCadence` for each round

## 📋 Example Case

**Scenario:**
- 6 columns total
- Minimum: 1 special symbol to start anticipation
- Maximum: 2 special symbols to end anticipation  
- Default cadence: 1
- Anticipate cadence: 2
- Special symbols at: column 1 row 2, column 4 row 3

**Expected Result:** `[0, 1, 3, 5, 7, 8]`

**Calculation Logic:**
- Column 0: 0 (starting point)
- Column 1: 0 + 1 = 1 (default cadence, no anticipation yet)
- Column 2: 1 + 2 = 3 (anticipation active due to special symbol in column 1)
- Column 3: 3 + 2 = 5 (anticipation continues)
- Column 4: 5 + 2 = 7 (anticipation continues)
- Column 5: 7 + 1 = 8 (anticipation ends after column 4 special symbol)

## 🚀 How to Run

### Prerequisites

```bash
# Install dependencies from project root
npm install
```

### Execution

```bash
# Navigate to Cadence directory
cd Cadence

# Run the implementation (requires TypeScript/Node.js)
npx ts-node SlotMachineCadence.ts

# Expected output format:
# CADENCES: {
#   roundOne: [calculated_cadence_array],
#   roundTwo: [calculated_cadence_array], 
#   roundThree: [calculated_cadence_array]
# }
```

### Configuration

This project uses the global configuration from the project root:
- **TypeScript:** `../tsconfig.json` for compilation settings
- **Dependencies:** `../package.json` for TypeScript and development tools

## ✅ Requirements

### What You Need to Deliver

1. **Complete Implementation:** Implement the `slotCadence` function logic
2. **Comprehensive Coverage:** Handle all possible special symbol coordinate scenarios
3. **Configurable Parameters:** Support different column quantities, min/max symbol thresholds
4. **Clean Code:** Well-commented and readable implementation
5. **Edge Case Handling:** Consider boundary conditions and special scenarios

### Success Criteria

- [ ] Function correctly calculates cadence for all test rounds
- [ ] Anticipation logic works with different symbol configurations
- [ ] Edge cases handled (min/max thresholds, different column positions)
- [ ] Code is clean, commented, and maintainable
- [ ] All game rounds produce expected cadence arrays

## 📞 Support

Feel free to contact us should you face any blocking issues or difficulties that stop your progress.
