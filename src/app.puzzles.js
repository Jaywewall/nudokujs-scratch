import { state } from './app.state.js';
import { loadBoard } from './app.board.js';

// --- PUZZLE LOADING ---
export async function loadPuzzles() {
    try {
        const response = await fetch('/puzzles.json');
        const data = await response.json();
        Object.assign(state.puzzleCatalog, data);
        loadSolvedPuzzles(); // Load solved data from localStorage

        const firstPuzzle = state.puzzleCatalog[state.activeDifficulty]?.[0] || state.puzzleCatalog.Easy?.[0];

        if (firstPuzzle) {
            loadBoard(firstPuzzle.puzzle, firstPuzzle.solution, firstPuzzle.id);
        } else {
            console.error("No puzzles found for default difficulties.");
            loadBoard(state.initialBoardString, state.initialSolutionString);
        }
    } catch (error) {
        console.error('Error loading puzzles:', error);
        loadBoard(state.initialBoardString, state.initialSolutionString);
    }
}

export function populatePuzzleList(difficulty) {
    const container = document.getElementById('puzzle-list-container');
    if (!container) return;

    const puzzles = state.puzzleCatalog[difficulty];
    if (!puzzles || puzzles.length === 0) {
        container.innerHTML = '<p class="text-sm text-center text-[var(--text-muted)]">No puzzles available for this difficulty.</p>';
        return;
    }

    container.innerHTML = ''; // Clear previous list
    puzzles.forEach(puzzle => {
        const isSolved = state.solvedPuzzlesData[difficulty]?.includes(puzzle.id);
        const button = document.createElement('button');
        button.classList.add('w-full', 'p-2', 'text-left', 'rounded-md', 'transition', 'flex', 'items-center', 'justify-between');

        if (puzzle.id === state.currentPuzzleId) {
            button.classList.add('bg-blue-500', 'text-white', 'font-medium');
        } else if (isSolved) {
            button.classList.add('bg-green-100', 'hover:bg-green-200', 'text-green-800');
        } else {
            button.classList.add('bg-white', 'hover:bg-slate-200');
        }

        const puzzleIdSpan = document.createElement('span');
        puzzleIdSpan.textContent = `Puzzle #${puzzle.id}`;

        button.appendChild(puzzleIdSpan);

        if (isSolved) {
            const checkmark = document.createElement('span');
            checkmark.innerHTML = '&#10003;'; // Checkmark symbol
            checkmark.classList.add('font-bold', 'text-green-600');
            button.appendChild(checkmark);
        }

        button.addEventListener('click', () => {
            loadBoard(puzzle.puzzle, puzzle.solution, puzzle.id);
            document.getElementById('new-game-select-modal').style.display = 'none';
            document.getElementById('modal-backdrop').style.display = 'none';
        });
        container.appendChild(button);
    });
}


function loadSolvedPuzzles() {
    const solved = localStorage.getItem('solvedPuzzles');
    if (solved) {
        state.solvedPuzzlesData = JSON.parse(solved);
    } else {
        state.solvedPuzzlesData = { Easy: [], Medium: [], Hard: [], Expert: [] };
    }
}

export function saveSolvedPuzzles() {
    localStorage.setItem('solvedPuzzles', JSON.stringify(state.solvedPuzzlesData));
}
