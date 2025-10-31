import { state, grid, numberPicker, radialMenu, inputPill } from './app.state.js';
import { renderBoard } from './app.render.js';

// --- UI עדכונים ---

export function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('header-undo-btn');
    const redoBtn = document.getElementById('header-redo-btn');
    const popoverUndoBtn = document.getElementById('popover-undo-btn');
    const popoverRedoBtn = document.getElementById('popover-redo-btn');

    if (undoBtn) undoBtn.disabled = state.historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = state.historyIndex >= state.history.length - 1;
    if (popoverUndoBtn) popoverUndoBtn.disabled = state.historyIndex <= 0;
    if (popoverRedoBtn) popoverRedoBtn.disabled = state.historyIndex >= state.history.length - 1;
}

export function clearSelections() {
    clearCellSelections();
    clearTappedTarget();
    clearHighlights();
}

export function clearCellSelections() {
    if (state.selectedCells.size > 0) {
        state.selectedCells.forEach(index => {
            grid.children[index]?.classList.remove('selected');
        });
        state.selectedCells.clear();
        renderBoard(); // Re-render to remove selection styles
    }
}

export function clearTappedTarget() {
    if (state.tappedTargetCellIndex !== null) {
        const prevTarget = grid.children[state.tappedTargetCellIndex];
        if (prevTarget) {
            prevTarget.classList.remove('tapped-target');
        }
        state.tappedTargetCellIndex = null;
        renderBoard(); // Re-render to remove target styles
    }
}

export function clearHighlights() {
    const highlightedButton = numberPicker.querySelector('.picker-selected');
    if (highlightedButton) {
        highlightedButton.classList.remove('picker-selected');
    }
    if (state.tappedTargetCellIndex !== null) {
        clearTappedTarget();
    }
    renderBoard();
}


export function highlightNumber(num) {
    const buttons = numberPicker.querySelectorAll('.number-picker-btn');
    buttons.forEach(btn => {
        if (parseInt(btn.dataset.number) === num) {
            btn.classList.add('picker-selected');
        } else {
            btn.classList.remove('picker-selected');
        }
    });
    if (state.tappedTargetCellIndex !== null) {
        clearTappedTarget();
    }
    renderBoard();
}

export function showModal(modalName) {
    if (state.modals[modalName]) {
        state.modals.backdrop.style.display = 'block';
        state.modals[modalName].style.display = 'block';
        state.modals.backdrop.offsetHeight;
        state.modals[modalName].offsetHeight;
        state.modals.backdrop.classList.remove('opacity-0');
        state.modals[modalName].classList.remove('opacity-0', 'scale-95');
    }
}

export function hideModal(modalName) {
    if (state.modals[modalName] && state.modals[modalName].style.display === 'block') {
        state.modals.backdrop.classList.add('opacity-0');
        state.modals[modalName].classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            state.modals.backdrop.style.display = 'none';
            state.modals[modalName].style.display = 'none';
        }, 300);
    }
}


export function showRadialMenu(cellIndex) {
    const cellRect = grid.children[cellIndex].getBoundingClientRect();
    state.radialTargetIndex = cellIndex;
    radialMenu.style.left = `${cellRect.left + cellRect.width / 2 - 100}px`;
    radialMenu.style.top = `${cellRect.top + cellRect.height / 2 - 100}px`;
    radialMenu.style.display = 'block';
    radialMenu.offsetHeight;
    radialMenu.classList.remove('opacity-0', 'scale-75');
}

export function hideRadialMenu() {
    radialMenu.classList.add('opacity-0', 'scale-75');
    setTimeout(() => {
        radialMenu.style.display = 'none';
        state.radialTargetIndex = null;
    }, 150);
}


export function showInputPill(button, coords) {
    const rect = button.getBoundingClientRect();
    const pillHeight = inputPill.offsetHeight || 200;
    inputPill.style.left = `${rect.left + rect.width / 2 - inputPill.offsetWidth / 2}px`;
    inputPill.style.top = `${rect.top - pillHeight - 10}px`;

    inputPill.style.display = 'flex';
    inputPill.offsetHeight;
    inputPill.classList.remove('opacity-0', 'scale-90');
}

export function hideInputPill() {
    inputPill.classList.add('opacity-0', 'scale-90');
    setTimeout(() => {
        inputPill.style.display = 'none';
    }, 100);
}

export function addHoldIndicator(btn) {
    const indicator = document.createElement('div');
    indicator.classList.add('hold-progress-indicator');
    indicator.innerHTML = `<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="23"></circle></svg>`;
    btn.appendChild(indicator);
}

export function removeHoldIndicator(btn) {
    const indicator = btn.querySelector('.hold-progress-indicator');
    if (indicator) {
        indicator.remove();
    }
}
