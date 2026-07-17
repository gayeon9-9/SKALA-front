const TODO_STORAGE_KEY = "levelUpToday.todos";
const DELETED_STORAGE_KEY = "levelUpToday.deletedTodos";
const THEME_STORAGE_KEY = "levelUpToday.theme";

const sampleTodos = [
    {
        id: 1,
        text: "JavaScript 모듈 복습하기",
        done: false,
        category: "study",
        priority: "high",
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        text: "기숙사 짐 정리하기",
        done: false,
        category: "life",
        priority: "low",
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        text: "포트폴리오 문장 다듬기",
        done: true,
        category: "work",
        priority: "normal",
        createdAt: new Date().toISOString()
    }
];

function loadTodos() {
    const savedTodos = localStorage.getItem(TODO_STORAGE_KEY);

    if (savedTodos === null) {
        return sampleTodos;
    }

    try {
        const parsedTodos = JSON.parse(savedTodos);
        return Array.isArray(parsedTodos) ? parsedTodos : sampleTodos;
    } catch (error) {
        console.error("저장된 할 일을 불러오지 못했습니다.", error);
        return sampleTodos;
    }
}

let todos = loadTodos();

function loadDeletedTodos() {
    const savedDeletedTodos = localStorage.getItem(DELETED_STORAGE_KEY);

    if (savedDeletedTodos === null) {
        return [];
    }

    try {
        const parsedDeletedTodos = JSON.parse(savedDeletedTodos);
        return Array.isArray(parsedDeletedTodos) ? parsedDeletedTodos : [];
    } catch (error) {
        console.error("삭제한 할 일을 불러오지 못했습니다.", error);
        return [];
    }
}

let deletedTodos = loadDeletedTodos();

function saveTodos() {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
}

function saveDeletedTodos() {
    localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(deletedTodos));
}

export function getTodos() {
    return todos.map((todo) => ({ ...todo }));
}

export function getDeletedTodos() {
    return deletedTodos.map((todo) => ({ ...todo }));
}

export function addTodo(text, category, priority) {
    const newTodo = {
        id: Date.now(),
        text,
        done: false,
        category,
        priority,
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    saveTodos();
}

export function toggleTodo(id) {
    const targetTodo = todos.find((todo) => todo.id === id);

    if (!targetTodo) {
        return;
    }

    targetTodo.done = !targetTodo.done;
    saveTodos();
}

export function deleteTodo(id) {
    const targetTodo = todos.find((todo) => todo.id === id);

    if (!targetTodo) {
        return;
    }

    deletedTodos.push({
        ...targetTodo,
        deletedAt: new Date().toISOString()
    });
    todos = todos.filter((todo) => todo.id !== id);
    saveTodos();
    saveDeletedTodos();
}

export function restoreTodo(id) {
    const targetTodo = deletedTodos.find((todo) => todo.id === id);

    if (!targetTodo) {
        return;
    }

    const { deletedAt, ...restoredTodo } = targetTodo;
    todos.push(restoredTodo);
    deletedTodos = deletedTodos.filter((todo) => todo.id !== id);
    saveTodos();
    saveDeletedTodos();
}

export function permanentlyDeleteTodo(id) {
    deletedTodos = deletedTodos.filter((todo) => todo.id !== id);
    saveDeletedTodos();
}

export function getSavedTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY) || "light";
}

export function saveTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}
