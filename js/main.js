//Todo list app by Afolabi Sheriff
//features
//store in localstorage of browser
//delete list items

const createButton = document.getElementById('createButton');
const btnTodoSave = document.getElementById('btnTodoSave');
const todoModal = document.getElementById('todoModal');

const itemTitle = document.getElementById('itemTitle');
const itemDescr = document.getElementById('itemDescr');
const itemPriority = document.getElementById('itemPriority');

const itemSearch = document.getElementById('itemSearch');
const itemFilterPriority = document.getElementById('itemFilterPriority');

let editItem = undefined;

let todoList = document.getElementById('todoList');
let currentRow = null;
let colCount = 0;
let listArray = [];

let filterTitle = '';
let filterPriority = 'all';
let filterDone = 'all';
//declare addToList function

function showNewModal() {
  itemTitle.value = '';
  itemDescr.value = '';
  itemPriority.value = 'High';
  $('#todoModal').modal('show');
}

function newTodoItem(title, description, priority) {
    return {
      title: title,
      description: description,
      priority: priority,
      done: false
    }
}
//function to chage the dom of the list of todo list
var createItemDom = function(itemTodo){

    const cellItem = document.createElement('div');
    const cardStyle = itemTodo.done ? "done" : "";

    cellItem.setAttribute("class", "col-4");
    cellItem.innerHTML = `<div class="card ${cardStyle}"><div class="card-header">${itemTodo.title}</div>`+
    `<div class="card-body">${itemTodo.description}</div>`+
      `<div class="row m-2"><div class="col-6">` +
        `<h5><span class="badge badge-secondary">${itemTodo.priority}</span></h5>`+
      `</div><div class="col-6 text-right">` +
        `<div class="btn-group">` +
          `<button class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown"> ... </button>`+
          `<div class="dropdown-menu">`+
            `<a class="dropdown-item" onClick="changeListArray('${itemTodo.title}', true)" >done</a>`+
            `<a class="dropdown-item" onClick="editTodo('${itemTodo.title}')">edit</a>`+
            `<a class="dropdown-item" onClick="deleteFromListArray('${itemTodo.title}')">delete</a>`+
          `</div>`+
        `</div>`+
      `</div></div>`+
    `</div>`;
    return cellItem;
}

function newTodoRow() {
  currentRow = document.createElement('div');
  currentRow.setAttribute('class', 'row');
  todoList.appendChild(currentRow);
  colCount = 0;
}

function insertTodoCol(item) {
   currentRow.appendChild(item);
   colCount++;
   if (colCount>2){
      newTodoRow();
   }
}

const addToList = function(){
    const newItem = new newTodoItem(itemTitle.value, itemDescr.value, itemPriority.value);
    listArray.push(newItem);
    //add to the local storage
    refreshLocal();
    //change the dom
    var item = createItemDom(newItem);
    insertTodoCol(item);

}


function saveEditItem() {
  if (editItem === undefined) {
    return;
  }

  editItem.title = itemTitle.value;
  editItem.description = itemDescr.value;
  editItem.priority = itemPriority.value;
  refreshLocal();
  filterTodos();
}


function saveTodoItem() {
  $('#todoModal').modal('hide');
  if (editItem === undefined) {
      addToList();
  } else {
      saveEditItem();
  }
}


function changeListArray(title, status){
    console.log(title, status);
    for(var i=0; i < listArray.length; i++){

        if(listArray[i].title == title){
            listArray[i].done = status;
            refreshLocal();
            break;
        }
    }
    filterTodos();
}

function editTodo(title) {
  editItem = listArray.find(item=>{
    return item.title === title;
  });
  if (editItem === undefined) {
    return;
  }

  itemTitle.value = editItem.title;
  itemDescr.value = editItem.description;
  itemPriority.value = editItem.priority;
  $('#todoModal').modal('show');

}

function deleteFromListArray(title) {
  console.log(title);

  listArray = listArray.filter(item=> {
    return item.title && (item.title !== title);
  });
  refreshLocal();
  filterTodos();
}

var refreshLocal = function(){
    var todos = listArray;
    localStorage.removeItem('todoList');
    localStorage.setItem('todoList', JSON.stringify(todos));
}


//function to clear todo list array
var clearList = function(){
    listArray = [];
    localStorage.removeItem('todoList');
    todoList.innerHTML = '';
}

function clearTodos() {
    todoList.innerHTML = '';
    newTodoRow();
}

function showTodos(todos) {
  clearTodos();
  todos.forEach((item)=>{
    const col = createItemDom(item);
    insertTodoCol(col);
  });
}

function filterTodos() {
  filterArray = listArray.filter(item=> {
      const c1 = (filterTitle.length == 0) ||
                 (item.title && item.title.includes(filterTitle));

      const c2 = (filterPriority == "all") || (item.priority  && item.priority.toLowerCase() == filterPriority);
      const c3 = (filterDone == "all") || (item.done && filterDone=="done") || (!item.done && filterDone=="open");

      return c1 && c2 && c3;
  });
  showTodos(filterArray);
}

function filterByTitle(event) {
    filterTitle = event.target.value;
    filterTodos();
}

function filterByPriority(event) {
  filterPriority = event.target.value;
  filterTodos();
}

function filterByDone(event) {
  filterDone = event.target.value;
  filterTodos();
}

function filterByDone(event) {
  filterDone = event.target.value;
  filterTodos();
}

window.onload = function(){
    clearTodos();
    var listItem = localStorage.getItem('todoList');
    console.log (listItem);

    if (listItem !== null) {
        todos = JSON.parse(listItem);
        listArray = todos;
        showTodos(todos);
    }

};

//add an event binder to the button
createButton.addEventListener('click',showNewModal);
btnTodoSave.addEventListener('click',saveTodoItem);

itemSearch.addEventListener('input',filterByTitle);
itemFilterPriority.addEventListener('input',filterByPriority);
itemFilterDone.addEventListener('input',filterByDone);
