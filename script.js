let todos = (window.localStorage.getItem('todos'))? JSON.parse(window.localStorage.getItem('todos')) : [];
let activeTodos = [];
let completedTodos = [];

let inputBox = document.querySelector(".input");
let todosList = document.querySelector(".todos-list");

let allTodosBtn = document.querySelector(".all-todo");
let activeTodosBtn = document.querySelector(".active-todo");
let completedTodosBtn = document.querySelector(".completed-todo");

let clearCompletedTodosBtn = document.querySelector(".clear-completed-todos");

let todosCount = document.querySelector('.todos-count');

function todosCounter(){
  let allLeftTodos = todos.filter((todo) => !todo.isDone);
  todosCount.innerText = `${allLeftTodos.length} items left`;
}

todosCounter();

clearCompletedTodosBtn.addEventListener("click", () => {
  completedTodos.length = 0;
  todos = todos.filter((todo) => !todo.isDone);
  window.localStorage.setItem('todos', JSON.stringify(todos));
  if (completedTodosBtn.classList.contains("active")) {
    displayUI(completedTodos);
  } else if (allTodosBtn.classList.contains("active")) {
    displayUI();
  }
});

allTodosBtn.addEventListener("click", () => {
  active();
  displayUI();
});

activeTodosBtn.addEventListener("click", () => {
  active(activeTodosBtn);
  activeTodos = todos.filter((todo) => !todo.isDone);
  displayUI(activeTodos);
});

completedTodosBtn.addEventListener("click", () => {
  active(completedTodosBtn);
  completedTodos = todos.filter((todo) => todo.isDone);
  displayUI(completedTodos);
});

function active(element = allTodosBtn) {
  document.querySelector(".active")?.classList.remove("active");
  element.classList.add("active");
}

active();

function handleDelete(e) {
  let todoName = e.target.previousElementSibling.lastElementChild.innerText;
  let todosIndex = todos.findIndex((todo) => todo.name === todoName);
  let activeTodosIndex = activeTodos.findIndex(
    (todo) => todo.name === todoName
  );
  let completedTodosIndex = completedTodos.findIndex(
    (todo) => todo.name === todoName
  );
  todos.splice(todosIndex, 1);
  activeTodos.splice(activeTodosIndex, 1);
  completedTodos.splice(completedTodosIndex, 1);
  window.localStorage.setItem('todos', JSON.stringify(todos));
  todosCounter();
  if (allTodosBtn.classList.contains("active")) {
    displayUI();
  } else if (activeTodosBtn.classList.contains("active")) {
    displayUI(activeTodos);
  } else {
    displayUI(completedTodos);
  }
}

function handleCheck(e) {
  let id = e.target.dataset.id;
  if (allTodosBtn.classList.contains("active")) {
    todos[id].isDone = !todos[id].isDone;
    window.localStorage.setItem('todos', JSON.stringify(todos));
    todosCounter();
    displayUI();
  } else if (activeTodosBtn.classList.contains("active")) {
    activeTodos[id].isDone = !activeTodos[id].isDone;
    if (activeTodos[id].isDone) {
      e.target.nextElementSibling.classList.add("line-through");
    } else {
      e.target.nextElementSibling.classList.remove("line-through");
    }
    activeTodos = activeTodos.filter((todo) => !todo.isDone);
    todosCounter();
    setTimeout(() => {
      displayUI(activeTodos);
    }, 300);
  } else {
    completedTodos[id].isDone = !completedTodos[id].isDone;
    if (completedTodos[id].isDone) {
      e.target.nextElementSibling.classList.add("line-through");
    } else {
      e.target.nextElementSibling.classList.remove("line-through");
    }
    completedTodos = completedTodos.filter((todo) => todo.isDone);
    todosCounter();
    setTimeout(() => {
      displayUI(completedTodos);
    }, 300);
  }
}

function displayUI(array = todos) {
  todosList.innerHTML = "";
  array.forEach((todo, index) => {
    let li = document.createElement("li");
    li.classList.add("todo");

    let div = document.createElement("div");
    div.classList.add("todo-info");

    let input = document.createElement("input");
    input.type = "checkbox";
    input.checked = todo.isDone;
    input.classList.add("todo-check");
    input.setAttribute("data-id", index);

    input.addEventListener("click", handleCheck);

    let label = document.createElement("label");
    label.classList.add("todo-name");
    label.innerText = todo.name;

    let button = document.createElement("button");
    button.innerText = "✖";
    button.classList.add("todo-close");
    button.setAttribute("data-id", index);

    button.addEventListener("click", handleDelete);

    div.append(input, label);
    li.append(div, button);
    todosList.append(li);

    if (input.checked) {
      input.nextElementSibling.classList.add("line-through");
    } else {
      input.nextElementSibling.classList.remove("line-through");
    }
  });
}

displayUI();

function handleInput(e) {
  let value = e.target.value;
  if (e.keyCode === 13 && e.target.value !== "") {
    let todo = { name: value, isDone: false };
    todos.push(todo);
    window.localStorage.setItem('todos', JSON.stringify(todos));
    e.target.value = "";
    todosCounter();
    if (completedTodosBtn.classList.contains("active")) {
      displayUI(completedTodos);
    } else if (activeTodosBtn.classList.contains("active")) {
      activeTodos = todos.filter((todo) => !todo.isDone);
      displayUI(activeTodos);
    } else {
      displayUI();
    }
  }
}

inputBox.addEventListener("keyup", handleInput);
