import { useState } from "react";
import "./App.css";

const STORAGE_KEY = "my-tasks";

function loadSavedTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);

    if (savedTodos === null) {
      return { todos: [], error: "" };
    }

    const parsedTodos = JSON.parse(savedTodos);
    const isValid = Array.isArray(parsedTodos) && parsedTodos.every(
      (todo) =>
        todo &&
        typeof todo.id === "string" &&
        typeof todo.title === "string" &&
        typeof todo.completed === "boolean"
    );

    if (!isValid) {
      throw new Error("Saved task data has an invalid format.");
    }

    return { todos: parsedTodos, error: "" };
  } catch (error) {
    console.error("Could not load saved tasks.", error);
    return {
      todos: [],
      error: "Saved tasks could not be loaded. Add a task to save a fresh list.",
    };
  }
}

// Main App Component
function App() {
  const [savedState] = useState(loadSavedTodos);
  const [todos, setTodos] = useState(savedState.todos);
  const [storageError, setStorageError] = useState(savedState.error);
  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const saveTodos = (nextTodos) => {
    setTodos(nextTodos);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTodos));
      setStorageError("");
    } catch (error) {
      console.error("Could not save tasks.", error);
      setStorageError("Your changes could not be saved in this browser.");
    }
  };

  // Add new task
  const handleSubmit = (e) => {
    e.preventDefault();

    const title = task.trim();
    if (!title) return;

    const newTodo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    saveTodos([...todos, newTodo]);
    setTask("");
  };

  // Mark task complete or incomplete
  const toggleTodo = (id) => {
    saveTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // Delete task
  const deleteTodo = (id) => {
    saveTodos(todos.filter((todo) => todo.id !== id));
  };

  // Edit task
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.title);
  };

  const saveEdit = (id) => {
    const title = editText.trim();
    if (!title) return;

    saveTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, title } : todo
      )
    );

    setEditingId(null);
    setEditText("");
  };

  // Filter tasks
  const filteredTodos = todos.filter((todo) => {
    if (filter === "Active") return !todo.completed;
    if (filter === "Completed") return todo.completed;
    return true;
  });
  const completedCount = todos.filter((todo) => todo.completed).length;
  const remainingCount = todos.length - completedCount;
  const progressPercent = todos.length
    ? Math.round((completedCount / todos.length) * 100)
    : 0;

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand-mark" aria-hidden="true">✓</div>
        <div>
          <p className="eyebrow">YOUR PERSONAL SPACE</p>
          <h1>My Tasks<span className="title-dot">.</span></h1>
        </div>
        <span className="header-note">ONE STEP AT A TIME</span>
      </header>
      <section className="task-stats" aria-label="Task summary">
        <article className="stat-card stat-total">
          <span className="stat-label">Total tasks</span>
          <strong>{todos.length}</strong>
        </article>
        <article className="stat-card stat-remaining">
          <span className="stat-label">Remaining</span>
          <strong>{remainingCount}</strong>
        </article>
        <article className="stat-card stat-completed">
          <span className="stat-label">Completed</span>
          <strong>{completedCount}</strong>
        </article>
      </section>
      <section className="progress-section" aria-label="Task progress">
        <div className="progress-copy">
          <span>Overall progress</span>
          <strong>{progressPercent}%</strong>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Tasks completed"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
        >
          <span style={{ width: `${progressPercent}%` }} />
        </div>
      </section>
      <p className="subtitle">Make room for what matters. A little progress goes a long way.</p>

      {storageError && <p className="storage-notice" role="status">{storageError}</p>}

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          placeholder="What would you like to get done?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          aria-label="New task"
        />
        <button type="submit">＋ Add task</button>
      </form>

      <div className="section-heading">
        <h2>Your list</h2>
        <span className="task-total">{todos.length} {todos.length === 1 ? "task" : "tasks"}</span>
      </div>

      <div className="filters">
        {["All", "Active", "Completed"].map((item) => (
          <button
            key={item}
            type="button"
            className={filter === item ? "selected" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              aria-label={`Mark "${todo.title}" as ${todo.completed ? "active" : "completed"}`}
            />

            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                aria-label="Edit task"
              />
            ) : (
              <span
                className={todo.completed ? "completed" : ""}
              >
                {todo.title}
              </span>
            )}

            {editingId === todo.id ? (
              <button type="button" onClick={() => saveEdit(todo.id)}>
                Save
              </button>
            ) : (
              <button type="button" onClick={() => startEditing(todo)}>
                Edit
              </button>
            )}

            <button
              type="button"
              className="delete-button"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete "${todo.title}"`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p className="empty">
          {todos.length === 0
            ? "Your list is looking fresh. Add a task to get started."
            : "No tasks in this view. Try another filter."}
        </p>
      )}

      <p className="count">
        <strong>{completedCount}</strong> of{" "}
        <strong>{todos.length}</strong> tasks completed
      </p>
    </div>
  );
}

export default App;