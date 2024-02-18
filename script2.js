const createBtn = document.getElementById('create-btn');
const list = document.getElementById('list');

let todos = [];

createBtn.addEventListener('click', create_New_Todo )

function create_New_Todo() {
    //새로운 아이템 객체 생성
    const item = {  id: crypto.randomUUID(),
                    text: "",
                    complete: false
                }
    //배열의 처음에 새로운 아이템 추가
    todos.unshift(item);    // item 객체를 todos 배열에 추가한 후에
                            // item 객체의 속성이 변경되면, todos 배열에 있는 
                            // 해당 객체의 속성도 변경

    //요소 생성하기
    const {
        itemEl ,
        inputEl ,
        editBtnEl,
        removeBtnEl
    } = create_Todo_element(item)

    //리스트 요소 안에 방금 생성한 아이템 요소 추가
    list.prepend(itemEl);

    //disable 속성 제거, 입력칸 활성화
    inputEl.removeAttribute('disabled');
    //input 요소에 focus
    inputEl.focus();

    saveToLocalStorage();
}

function create_Todo_element(item) {
    const itemEl = document.createElement('div')
    itemEl.classList.add('item')

    const checkboxEl = document.createElement('input')
    checkboxEl.type = 'checkbox';
    checkboxEl.checked = item.complete;

    if (item.complete) {
        itemEl.classList.add('completed');
    }
    // 현재 시간을 나타내는 요소 생성
    const timeEl = document.createElement('span');
    timeEl.textContent = (getCurrentDate() +" / " + getCurrentTime()); // 현재 시간을 가져와 요소에 추가

    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.value = item.text;
    inputEl.setAttribute('disabled', '');

    const actionsEl = document.createElement('div');
    actionsEl.classList.add('action');

    const editBtnEl = document.createElement('button');
    editBtnEl.classList.add('material-icons');
    editBtnEl.innerText = 'edit';
    
    const removeBtnEl = document.createElement('button');
    removeBtnEl.classList.add('material-icons', 'remove-btn');
    removeBtnEl.innerText ='remove_circle';

    actionsEl.append(editBtnEl);
    actionsEl.append(removeBtnEl);

    itemEl.append(checkboxEl);
    itemEl.append(inputEl);
    itemEl.append(timeEl); // 현재 시간 요소를 추가
    itemEl.append(actionsEl);

    // EVENTS
	checkboxEl.addEventListener("change", () => {
		item.complete = checkboxEl.checked;

		if (item.complete) {
			itemEl.classList.add("complete");
		} else {
			itemEl.classList.remove("complete");
		}

		saveToLocalStorage();
	});

	inputEl.addEventListener("input", () => {
		item.text = inputEl.value;
	});

	inputEl.addEventListener("blur", () => {
		inputEl.setAttribute("disabled", "");

		saveToLocalStorage();
	});

	editBtnEl.addEventListener("click", () => {
		inputEl.removeAttribute("disabled");
		inputEl.focus();
	});

	removeBtnEl.addEventListener("click", () => {
		todos = todos.filter(t => t.id != item.id);
		itemEl.remove();

		saveToLocalStorage();
	});


    return {
        itemEl : itemEl,
        inputEl : inputEl,
        editBtnEl : editBtnEl,
        removeBtnEl : removeBtnEl
    }
}

// 현재 날짜를 반환하는 함수
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 현재 시간을 반환하는 함수
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes()
    .toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
function displayTodos() {
	loadFromLocalStorage();

	for (let i = 0; i < todos.length; i++) {
		const item = todos[i];

		const { itemEl } = createTodoElement(item);

		list.append(itemEl);
	}
}

displayTodos();

function saveToLocalStorage() {
	const data = JSON.stringify(todos);

	localStorage.setItem("my_todos", data);
}

function loadFromLocalStorage() {
	const data = localStorage.getItem("my_todos");

	if (data) {
		todos = JSON.parse(data);
	}
}