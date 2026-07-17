import {
    getTodos,
    getDeletedTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    restoreTodo,
    permanentlyDeleteTodo,
    getSavedTheme,
    saveTheme
} from "../과제js/storage.js";

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const categorySelect = document.getElementById("categorySelect");
const prioritySelect = document.getElementById("prioritySelect");
const inputMessage = document.getElementById("inputMessage");
const todoList = document.getElementById("todoList");
const deletedList = document.getElementById("deletedList");
const deletedCount = document.getElementById("deletedCount");
const trashDetails = document.getElementById("trashDetails");
const filterGroup = document.getElementById("filterGroup");
const filterButtons = document.querySelectorAll(".filter-button");
const categoryFilterGroup = document.getElementById("categoryFilterGroup");
const categoryFilterButtons = document.querySelectorAll(".category-filter-button");
const allCount = document.getElementById("allCount");
const activeCount = document.getElementById("activeCount");
const completedCount = document.getElementById("completedCount");
const summaryTotal = document.getElementById("summaryTotal");
const summaryCompleted = document.getElementById("summaryCompleted");
const xpEarned = document.getElementById("xpEarned");
const xpTotal = document.getElementById("xpTotal");
const progressPercent = document.getElementById("progressPercent");
const progressBar = document.getElementById("progressBar");
const progressTrack = document.querySelector(".progress-track");
const progressMessage = document.getElementById("progressMessage");
const clearBanner = document.getElementById("clearBanner");
const currentDate = document.getElementById("currentDate");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteRefresh = document.getElementById("quoteRefresh");
const themeToggle = document.getElementById("themeToggle");

const categoryNames = {
    study: "학습",
    life: "생활",
    work: "업무",
    etc: "기타"
};

const priorityInfo = {
    high: { label: "높음", xp: 30 },
    normal: { label: "보통", xp: 20 },
    low: { label: "낮음", xp: 10 }
};

let currentFilter = "all";
let currentCategory = "all";

function getFilteredTodos(todos) {
    let filteredTodos = todos;

    if (currentFilter === "active") {
        filteredTodos = filteredTodos.filter((todo) => !todo.done);
    }

    if (currentFilter === "completed") {
        filteredTodos = filteredTodos.filter((todo) => todo.done);
    }

    if (currentCategory !== "all") {
        filteredTodos = filteredTodos.filter((todo) => todo.category === currentCategory);
    }

    return filteredTodos;
}

function createBadge(text, className) {
    const badge = document.createElement("span");
    badge.className = className;
    badge.textContent = text;
    return badge;
}

function createTodoElement(todo) {
    const item = document.createElement("li");
    item.className = "todo-item";
    item.dataset.id = todo.id;

    if (todo.done) {
        item.classList.add("completed");
    }

    const checkboxLabel = document.createElement("label");
    checkboxLabel.className = "checkbox-label";

    const checkbox = document.createElement("input");
    checkbox.className = "todo-checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.setAttribute("aria-label", `${todo.text} 완료 상태 변경`);

    const checkmark = document.createElement("span");
    checkmark.className = "custom-checkbox";
    checkmark.setAttribute("aria-hidden", "true");
    checkboxLabel.append(checkbox, checkmark);

    const content = document.createElement("div");
    content.className = "todo-content";

    const todoText = document.createElement("p");
    todoText.className = "todo-text";
    todoText.textContent = todo.text;

    const meta = document.createElement("div");
    meta.className = "todo-meta";
    meta.append(
        createBadge(categoryNames[todo.category] || "기타", `category-badge ${todo.category}`),
        createBadge(
            `${priorityInfo[todo.priority].label} · ${priorityInfo[todo.priority].xp} XP`,
            `priority-badge ${todo.priority}`
        )
    );
    content.append(todoText, meta);

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `${todo.text} 삭제`);

    item.append(checkboxLabel, content, deleteButton);
    return item;
}

function createDeletedTodoElement(todo) {
    const item = document.createElement("li");
    item.className = "deleted-item";
    item.dataset.id = todo.id;

    const content = document.createElement("div");
    content.className = "deleted-content";

    const text = document.createElement("strong");
    text.textContent = todo.text;

    const meta = document.createElement("span");
    meta.textContent = `${categoryNames[todo.category] || "기타"} · ${priorityInfo[todo.priority].xp} XP`;
    content.append(text, meta);

    const actions = document.createElement("div");
    actions.className = "deleted-actions";

    const restoreButton = document.createElement("button");
    restoreButton.className = "restore-button";
    restoreButton.type = "button";
    restoreButton.textContent = "복원";
    restoreButton.setAttribute("aria-label", `${todo.text} 복원`);

    const permanentDeleteButton = document.createElement("button");
    permanentDeleteButton.className = "permanent-delete-button";
    permanentDeleteButton.type = "button";
    permanentDeleteButton.textContent = "영구 삭제";
    permanentDeleteButton.setAttribute("aria-label", `${todo.text} 영구 삭제`);

    actions.append(restoreButton, permanentDeleteButton);
    item.append(content, actions);
    return item;
}

function renderDeletedTodos() {
    const deletedTodos = getDeletedTodos();
    deletedList.replaceChildren();
    deletedCount.textContent = deletedTodos.length;

    if (deletedTodos.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "deleted-empty";
        emptyItem.textContent = "최근 삭제한 퀘스트가 없습니다.";
        deletedList.append(emptyItem);
        return;
    }

    deletedTodos.forEach((todo) => {
        deletedList.append(createDeletedTodoElement(todo));
    });
}

function getEmptyMessage() {
    if (currentCategory !== "all") {
        return `${categoryNames[currentCategory]} 카테고리에 해당하는 퀘스트가 없습니다.`;
    }

    if (currentFilter === "active") {
        return "진행 중인 퀘스트가 없습니다.";
    }

    if (currentFilter === "completed") {
        return "아직 완료한 퀘스트가 없습니다.";
    }

    return "아직 등록된 퀘스트가 없습니다. 새로운 할 일을 추가해 보세요!";
}

function updateDashboard(todos) {
    const completedTodos = todos.filter((todo) => todo.done);
    const completedTotal = completedTodos.length;
    const activeTotal = todos.length - completedTotal;
    const earnedXP = completedTodos.reduce((total, todo) => {
        return total + priorityInfo[todo.priority].xp;
    }, 0);
    const totalPossibleXP = todos.reduce((total, todo) => {
        return total + priorityInfo[todo.priority].xp;
    }, 0);
    const percentage = totalPossibleXP === 0 ? 0 : Math.round((earnedXP / totalPossibleXP) * 100);

    allCount.textContent = todos.length;
    activeCount.textContent = activeTotal;
    completedCount.textContent = completedTotal;
    summaryTotal.textContent = todos.length;
    summaryCompleted.textContent = completedTotal;
    xpEarned.textContent = earnedXP;
    xpTotal.textContent = totalPossibleXP;
    progressPercent.textContent = `${percentage}%`;
    progressBar.style.width = `${percentage}%`;
    progressTrack.setAttribute("aria-valuenow", percentage);

    if (percentage === 0) {
        progressMessage.textContent = "첫 번째 퀘스트를 시작해 보세요!";
    } else if (percentage < 50) {
        progressMessage.textContent = "좋은 시작이에요. 계속 진행해 보세요!";
    } else if (percentage < 100) {
        progressMessage.textContent = "절반 이상 완료했어요. 다음 퀘스트도 이어가세요.";
    } else {
        progressMessage.textContent = "오늘의 모든 퀘스트를 완료했습니다!";
    }

    clearBanner.hidden = todos.length === 0 || completedTotal !== todos.length;
}

function render() {
    const todos = getTodos();
    const filteredTodos = getFilteredTodos(todos);
    todoList.replaceChildren();

    if (filteredTodos.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "empty-state";
        emptyItem.textContent = getEmptyMessage();
        todoList.append(emptyItem);
    } else {
        filteredTodos.forEach((todo) => {
            todoList.append(createTodoElement(todo));
        });
    }

    updateDashboard(todos);
    renderDeletedTodos();
}

todoForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const text = todoInput.value.trim();

    if (text === "") {
        inputMessage.textContent = "할 일을 입력한 후 추가해 주세요.";
        todoInput.focus();
        return;
    }

    addTodo(text, categorySelect.value, prioritySelect.value);
    todoInput.value = "";
    inputMessage.textContent = "퀘스트가 추가되었습니다.";
    todoInput.focus();
    render();
});

// 이벤트 위임: 동적으로 생성되는 모든 체크박스와 삭제 버튼을 부모 ul 한 곳에서 처리합니다.
todoList.addEventListener("click", (event) => {
    const todoItem = event.target.closest(".todo-item");

    if (!todoItem) {
        return;
    }

    const todoId = Number(todoItem.dataset.id);

    if (event.target.matches(".todo-checkbox")) {
        toggleTodo(todoId);
        render();
        return;
    }

    if (event.target.closest(".delete-button")) {
        deleteTodo(todoId);
        inputMessage.textContent = "퀘스트를 최근 삭제함으로 이동했습니다.";
        render();
    }
});

// 삭제함도 부모 ul 한 곳에서 복원·영구 삭제 이벤트를 처리합니다.
deletedList.addEventListener("click", (event) => {
    const deletedItem = event.target.closest(".deleted-item");

    if (!deletedItem) {
        return;
    }

    const todoId = Number(deletedItem.dataset.id);

    if (event.target.closest(".restore-button")) {
        restoreTodo(todoId);
        inputMessage.textContent = "퀘스트를 복원했습니다.";
        render();
        return;
    }

    if (event.target.closest(".permanent-delete-button")) {
        permanentlyDeleteTodo(todoId);
        inputMessage.textContent = "퀘스트를 영구 삭제했습니다.";
        render();
    }
});

filterGroup.addEventListener("click", (event) => {
    const selectedButton = event.target.closest(".filter-button");

    if (!selectedButton) {
        return;
    }

    currentFilter = selectedButton.dataset.filter;

    filterButtons.forEach((button) => {
        const isActive = button === selectedButton;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive);
    });

    render();
});

categoryFilterGroup.addEventListener("click", (event) => {
    const selectedButton = event.target.closest(".category-filter-button");

    if (!selectedButton) {
        return;
    }

    currentCategory = selectedButton.dataset.category;

    categoryFilterButtons.forEach((button) => {
        const isActive = button === selectedButton;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive);
    });

    render();
});

function showCurrentDate() {
    const today = new Date();
    currentDate.dateTime = today.toISOString().split("T")[0];
    currentDate.textContent = new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long"
    }).format(today);
}

async function loadQuote() {
    quoteText.textContent = "오늘의 한마디를 불러오는 중...";
    quoteAuthor.textContent = "";
    quoteRefresh.disabled = true;

    try {
        const response = await fetch("https://dummyjson.com/quotes/random");

        if (!response.ok) {
            throw new Error("오늘의 한마디 요청에 실패했습니다.");
        }

        const data = await response.json();
        quoteText.textContent = `“${data.quote}”`;
        quoteAuthor.textContent = `— ${data.author}`;
    } catch (error) {
        console.error(error);
        quoteText.textContent = "“오늘의 작은 완료가 내일의 레벨을 만듭니다.”";
        quoteAuthor.textContent = "— LEVEL UP: TODAY";
    } finally {
        quoteRefresh.disabled = false;
    }
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const isDark = theme === "dark";
    themeToggle.querySelector("span").textContent = isDark ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", isDark ? "라이트 모드로 변경" : "다크 모드로 변경");
}

themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
});

quoteRefresh.addEventListener("click", loadQuote);

applyTheme(getSavedTheme());
showCurrentDate();
render();
loadQuote();
