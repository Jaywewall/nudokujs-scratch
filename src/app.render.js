import { state, grid, numberPicker } from './app.state.js';
import { COLORS } from './app.state.js';

// --- RENDERING ---
export function renderBoard() {
    const highlightedButton = numberPicker.querySelector('.picker-selected');
    const highlightedNum = highlightedButton ? parseInt(highlightedButton.dataset.number, 10) : null;
    const isAnyCellSelected = state.selectedCells.size > 0;

    for (let i = 0; i < 81; i++) {
        const cellState = state.gameState[i];
        const cellElement = grid.children[i];
        cellElement.innerHTML = ''; // Clear previous content

        // --- Base Styling & State Classes ---
        cellElement.className = 'sudoku-cell flex items-center justify-center text-2xl cursor-pointer relative';
        if (cellState.isGiven) cellElement.classList.add('font-medium', 'text-slate-700');
        if (state.selectedCells.has(i)) cellElement.classList.add('selected');
        if (state.tappedTargetCellIndex === i) cellElement.classList.add('tapped-target');

        // --- Blackout Mode Logic ---
        let isBlackedOut = false;
        if (state.isBlackoutModeEnabled && highlightedNum !== null) {
            if (cellState.value && cellState.value !== highlightedNum) isBlackedOut = true;
            if (cellState.antiCandidates.has(highlightedNum)) isBlackedOut = true;
        }
        if (isBlackedOut) cellElement.classList.add('blacked-out');

        // --- Content Rendering ---
        if (cellState.value) {
            const valueSpan = document.createElement('span');
            valueSpan.textContent = cellState.value;
            valueSpan.classList.add(`c${cellState.value}`);
            if (isBlackedOut) valueSpan.style.opacity = '0'; // Fast fade for numbers
            cellElement.appendChild(valueSpan);
        } else {
            const candidatesGrid = document.createElement('div');
            candidatesGrid.className = 'candidates-grid';
            for (let num = 1; num <= 9; num++) {
                const candidateDiv = document.createElement('div');
                candidateDiv.className = 'candidate-item';
                if (cellState.candidates.has(num)) {
                    candidateDiv.textContent = num;
                    candidateDiv.classList.add(`c${num}`);
                }
                if (cellState.antiCandidates.has(num)) {
                    candidateDiv.classList.add('anti');
                    candidateDiv.textContent = num;
                }
                candidatesGrid.appendChild(candidateDiv);
            }
            cellElement.appendChild(candidatesGrid);
        }

        // --- Highlighting Logic ---
        if (!isAnyCellSelected) { // Only apply peer/value highlights if no cells are selected
            if (highlightedNum !== null && cellState.value === highlightedNum) {
                cellElement.classList.add(`bgc${highlightedNum}`);
            } else if (state.peers[i] && state.tappedTargetCellIndex !== null && state.peers[i].all.has(state.tappedTargetCellIndex)) {
                cellElement.classList.add('bg-slate-200');
            }
        }
    }

    // --- ASSISTANCE FEATURE RENDERING ---
    if (state.isAssistBiValueActive) {
        document.body.classList.add('assist-bivalue-active');
        state.gameState.forEach((cell, index) => {
            if (!cell.value && cell.candidates.size === 2) {
                grid.children[index].classList.add('bivalue-cell');
            }
        });
    } else {
        document.body.classList.remove('assist-bivalue-active');
        const biValueCells = grid.querySelectorAll('.bivalue-cell');
        biValueCells.forEach(cell => cell.classList.remove('bivalue-cell'));
    }
     // --- ADDED: Hidden Singles Pulse Animation ---
    const existingPulses = grid.querySelectorAll('[class*="animate-pulse-c"]');
    existingPulses.forEach(cell => {
        cell.className = cell.className.replace(/animate-pulse-c\d/g, '').trim();
    });

    if (state.isAssistHiddenSinglesActive) {
        state.gameState.forEach((cell, index) => {
            if (cell.hiddenSingle !== null) {
                grid.children[index].classList.add(`animate-pulse-c${cell.hiddenSingle}`);
            }
        });
    }

}
