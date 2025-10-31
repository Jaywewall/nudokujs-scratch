# Test Plan

## Objective

To ensure that all existing functionality and the visual appearance of the Sudoku application are preserved after the refactoring.

## Test Cases

### 1. Board Rendering
- **Steps:**
  1. Load the application.
  2. Verify that the Sudoku grid is displayed correctly.
  3. Verify that the number picker is displayed correctly.
- **Expected Outcome:** The grid and number picker are rendered as before the refactoring.

### 2. New Game
- **Steps:**
  1. Click the "New Game" button.
  2. Select a difficulty.
  3. Select a puzzle.
- **Expected Outcome:** A new puzzle of the selected difficulty is loaded and displayed correctly.

### 3. Number Input
- **Steps:**
  1. Click on a cell.
  2. Click on a number in the number picker.
  3. Verify that the number is entered as a candidate.
  4. Click on the same number again.
  5. Verify that the number is entered as an anti-candidate.
  6. Click on the same number again.
  7. Verify that the cell is cleared.
- **Expected Outcome:** The number input cycle (candidate -> anti-candidate -> clear) works as expected.

### 4. Deletion
- **Steps:**
  1. Select one or more cells.
  2. Click the "Delete" button in the number picker.
- **Expected Outcome:** The input from the selected cells is cleared.

### 5. Undo/Redo
- **Steps:**
  1. Make a few moves.
  2. Click the "Undo" button.
  3. Verify that the last move is undone.
  4. Click the "Redo" button.
  5. Verify that the undone move is redone.
- **Expected Outcome:** The undo and redo functionality works as expected.

### 6. Highlighting
- **Steps:**
  1. Click on a number in the number picker.
  2. Verify that all cells with that number are highlighted.
  3. Click on a cell with a number.
  4. Verify that all cells in the same row, column, and box are highlighted.
- **Expected Outcome:** The highlighting functionality works as expected.

### 7. Modals
- **Steps:**
  1. Click on the "How to Play", "Settings", and "Reset" buttons.
  2. Verify that the corresponding modals are displayed.
  3. Close the modals.
- **Expected Outcome:** All modals are displayed and can be closed correctly.

### 8. Assistance Features
- **Steps:**
  1. Open the "Assistance" modal.
  2. Enable "Highlight Bi-Value Cells".
  3. Verify that cells with two candidates are highlighted.
  4. Enable "Highlight Hidden Singles".
  5. Verify that hidden singles are highlighted.
  6. Click "Solve Single-Candidate Cells".
  7. Verify that all cells with a single candidate are filled.
- **Expected Outcome:** All assistance features work as expected.

### 9. Blackout Mode
- **Steps:**
  1. Open the "Settings" modal.
  2. Enable "Highlight Blackout Mode".
  3. Highlight a number.
- **Expected Outcome:** The blackout mode is applied correctly.
