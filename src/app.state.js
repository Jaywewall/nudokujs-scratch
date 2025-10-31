// --- DOM ELEMENTS ---
export const grid = document.getElementById('sudoku-grid');
export const numberPicker = document.getElementById('number-picker');
export const gameContainer = document.getElementById('game-container');
export const modals = {
    backdrop: document.getElementById('modal-backdrop'),
    info: document.getElementById('info-modal'),
    settings: document.getElementById('settings-modal'),
    reset: document.getElementById('reset-modal'),
    newGameSelect: document.getElementById('new-game-select-modal'),
    assistance: document.getElementById('assistance-modal'),
};
export const undoRedoPopover = document.getElementById('undo-redo-popover');
export const radialMenu = document.getElementById('radial-menu');
export const inputPill = document.getElementById('input-pill');

// --- GAME STATE ---
export const state = {
    initialBoardString: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
    initialSolutionString: "534678912672195348198342567859761423426853791713924856961537284287419635345286179",
    currentSolutionString: "",
    gameState: [],
    history: [],
    historyIndex: -1,
    selectedCells: new Set(),
    inputModeCell: null,
    pointerDownTime: 0,
    longPressTimer: null,
    isDragging: false,
    dragStartCell: null,
    dragMode: 'select',
    selectionIsActioned: false,
    lastDragIndex: -1,
    isCandidateIsolationMode: false,
    pickerSelectedNumbers: new Set(),
    pillSessionActive: false,
    longPressFired: false,
    lastTap: 0,
    lastTapIndex: -1,
    radialTargetIndex: null,
    tappedTargetCellIndex: null,
    isBlackoutModeEnabled: false,
    isAssistBiValueActive: false,
    isAssistHiddenSinglesActive: false,
    peers: [],
    puzzleCatalog: { Easy: [], Medium: [], Hard: [], Expert: [] },
    activeDifficulty: "Medium",
    solvedPuzzlesData: {},
    currentPuzzleId: null,
};

// --- CONSTANTS ---
export const LONG_PRESS_DURATION = 300; // ms
export const COLORS = Array.from({ length: 9 }, (_, i) => `var(--color-${i + 1})`);
export const DIFF_LABELS = ["Easy", "Medium", "Hard", "Expert"];
