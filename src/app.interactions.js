import { state } from './app.state.js';
import { renderBoard } from './app.render.js';
import { saveHistory } from './app.board.js';
import { clearSelections, clearTappedTarget, clearHighlights, highlightNumber, showRadialMenu, hideRadialMenu } from './app.ui.js';
import { LONG_PRESS_DURATION } from './app.state.js';

// --- INTERACTIONS ---

export function handleGridPointerDown(e) {
    e.preventDefault();
    const cell = e.target.closest('.sudoku-cell');
    if (!cell) return;

    const index = parseInt(cell.dataset.index);
    state.pointerDownTime = Date.now();
    state.isDragging = false;
    state.dragStartCell = index;
    state.selectionIsActioned = false;

    // Double tap logic
    const now = Date.now();
    if (now - state.lastTap < 300 && state.lastTapIndex === index) {
        clearTimeout(state.longPressTimer);
        showRadialMenu(index);
        return;
    }
    state.lastTap = now;
    state.lastTapIndex = index;

    state.longPressTimer = setTimeout(() => {
        state.isDragging = true;
        state.longPressFired = true;
        if (state.selectedCells.has(index)) {
            state.dragMode = 'deselect';
            state.selectedCells.delete(index);
        } else {
            state.dragMode = 'select';
            state.selectedCells.add(index);
        }
        renderBoard(); // Update visual state
    }, LONG_PRESS_DURATION);
}

export function handleGridPointerMove(e) {
    if (e.buttons !== 1 || !state.dragStartCell) return;
    const cell = e.target.closest('.sudoku-cell');
    if (!cell) return;

    const index = parseInt(cell.dataset.index);
    if (!state.isDragging && Date.now() - state.pointerDownTime > 150) {
        state.isDragging = true;
        state.longPressFired = true; // Prevents tap on release
        clearTimeout(state.longPressTimer);
        state.dragMode = state.selectedCells.has(state.dragStartCell) ? 'deselect' : 'select';
    }

    if (state.isDragging && index !== state.lastDragIndex) {
        state.lastDragIndex = index;
        if (state.dragMode === 'select' && !state.selectedCells.has(index)) {
            state.selectedCells.add(index);
            renderBoard();
        } else if (state.dragMode === 'deselect' && state.selectedCells.has(index)) {
            state.selectedCells.delete(index);
            renderBoard();
        }
    }
}

export function handleGridPointerUp(e) {
    clearTimeout(state.longPressTimer);
    if (!state.longPressFired && !state.isDragging) {
        const cell = e.target.closest('.sudoku-cell');
        if (!cell) return;
        const index = parseInt(cell.dataset.index);
        handleCellTap(index);
    }
    state.dragStartCell = null;
    state.isDragging = false;
    state.longPressFired = false;
    state.lastDragIndex = -1;
}

export function handleCellTap(index) {
    const cellState = state.gameState[index];
    const isSelected = state.selectedCells.has(index);

    if (state.selectedCells.size > 1 && isSelected) {
        clearCellSelections();
        state.tappedTargetCellIndex = index;
    } else if (state.selectedCells.size === 1 && isSelected) {
        clearCellSelections();
        state.tappedTargetCellIndex = index;
    } else {
        clearCellSelections();
        state.tappedTargetCellIndex = index;
    }
    renderBoard();
}

export function handleKeyboardInput(e) {
    if (e.ctrlKey || e.metaKey) { // Undo/Redo
        if (e.key === 'z') {
            e.preventDefault();
            if (state.historyIndex > 0) loadFromHistory(state.historyIndex - 1);
        } else if (e.key === 'y') {
            e.preventDefault();
            if (state.historyIndex < state.history.length - 1) loadFromHistory(state.historyIndex + 1);
        }
        return;
    }

    if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key);
        if (state.selectedCells.size > 0) {
            handleCandidateCycling(num);
        }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        let changeMade = false;
        state.selectedCells.forEach(index => {
            if (handleEraseInput(index)) changeMade = true;
        });
        if (changeMade) saveHistory();
        renderBoard();
    }
}


export function handleCandidateCycling(num) {
    let changeMade = false;
    let singleCellMode = state.selectedCells.size === 1;
    let firstCellIndex = singleCellMode ? state.selectedCells.values().next().value : null;
    let firstCellState = singleCellMode ? state.gameState[firstCellIndex] : null;

    let nextAction = 'candidate';
    if (singleCellMode && !firstCellState.isGiven) {
        if (firstCellState.candidates.has(num)) nextAction = 'anti-candidate';
        else if (firstCellState.antiCandidates.has(num)) nextAction = 'value';
        else if (firstCellState.value === num) nextAction = 'clear';
    } else if (!singleCellMode) {
        const allHaveCandidate = [...state.selectedCells].every(i => state.gameState[i].candidates.has(num));
        const allHaveAnti = [...state.selectedCells].every(i => state.gameState[i].antiCandidates.has(num));
        if (allHaveCandidate) nextAction = 'anti-candidate';
        else if (allHaveAnti) nextAction = 'clear';
    }


    state.selectedCells.forEach(index => {
        const cell = state.gameState[index];
        if (cell.isGiven) return;

        let currentAction = nextAction;
        if (!singleCellMode && nextAction === 'candidate') {
            if (cell.candidates.has(num)) currentAction = 'anti-candidate';
            else if (cell.antiCandidates.has(num)) currentAction = 'clear';
        }


        switch (currentAction) {
            case 'candidate':
                cell.candidates.add(num);
                cell.antiCandidates.delete(num);
                cell.value = null;
                changeMade = true;
                break;
            case 'anti-candidate':
                cell.candidates.delete(num);
                cell.antiCandidates.add(num);
                cell.value = null;
                changeMade = true;
                break;
            case 'value':
                cell.candidates.clear();
                cell.antiCandidates.clear();
                cell.value = num;
                changeMade = true;
                break;
            case 'clear':
                cell.candidates.delete(num);
                cell.antiCandidates.delete(num);
                cell.value = null;
                changeMade = true;
                break;
        }
    });

    if (changeMade) {
        saveHistory();
        renderBoard();
    }
}

export function handleEraseInput(cellIndex) {
    const cell = state.gameState[cellIndex];
    if (cell.isGiven) return false;
    let changed = cell.value !== null || cell.candidates.size > 0 || cell.antiCandidates.size > 0;
    cell.value = null;
    cell.candidates.clear();
    cell.antiCandidates.clear();
    return changed;
}

export function handleRadialInput(num, cellIndex) {
    const cell = state.gameState[cellIndex];
    if (cell.isGiven) return;
    cell.value = num;
    cell.candidates.clear();
    cell.antiCandidates.clear();
    saveHistory();
    clearSelections();
    clearTappedTarget();
    highlightNumber(num);
    renderBoard();
}

export async function solveCandidateSingles() {
    let changed = false;
    let solvedIndices = [];

    for (let i = 0; i < 81; i++) {
        const cell = state.gameState[i];
        if (!cell.value && cell.candidates.size === 1) {
            const lastCandidate = cell.candidates.values().next().value;
            cell.value = lastCandidate;
            cell.candidates.clear();
            cell.antiCandidates.clear();
            changed = true;
            solvedIndices.push(i);
        }
    }

    if (changed) {
        saveHistory();
        for (const index of solvedIndices) {
            const cellElement = grid.children[index];
            if (cellElement) {
                cellElement.classList.add('animate-rainbow-sweep');
                setTimeout(() => {
                    cellElement.classList.remove('animate-rainbow-sweep');
                }, 500);
            }
        }
    }
    renderBoard();
}

export function toggleCandidateIsolationMode(forceState) {
    state.isCandidateIsolationMode = forceState !== undefined ? forceState : !state.isCandidateIsolationMode;
    const picker = document.getElementById('number-picker');
    if (state.isCandidateIsolationMode) {
        picker.classList.add('candidate-isolation-mode');
        clearHighlights();
        clearSelections();
    } else {
        picker.classList.remove('candidate-isolation-mode');
        const isoBtn = picker.querySelector('.iso-selected');
        if (isoBtn) isoBtn.classList.remove('iso-selected');
    }
}

export function toggleIsolationNumber(num) {
    const btn = numberPicker.querySelector(`[data-number="${num}"]`);
    if (btn.classList.contains('iso-selected')) {
        btn.classList.remove('iso-selected');
        if (!numberPicker.querySelector('.iso-selected')) {
            toggleCandidateIsolationMode(false);
        }
    } else {
        btn.classList.add('iso-selected');
    }
}
