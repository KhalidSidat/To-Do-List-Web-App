// Grab the todo list container from the HTML
const list_el = document.getElementById("list");

// Grab the "Add new todo" button
const create_btn_el = document.getElementById("create");

// This array will hold ALL our todos
let todos = [];

// When the add button is clicked, run CreateNewTodo
create_btn_el.addEventListener('click', CreateNewTodo);

function CreateNewTodo () {
	// Create a new todo object
	const item = {
		id: new Date().getTime(), // Unique ID based on time
		text: "",                 // Todo text starts empty
		complete: false           // Not completed yet
	}

	// Add the new todo to the START of the array
	todos.unshift(item);

	// Create the HTML for this todo
	const { item_el, input_el } = CreateTodoElement(item);

	// Add it to the top of the list on the page
	list_el.prepend(item_el);

	// Enable typing right away
	input_el.removeAttribute("disabled");
	input_el.focus();

	// Save everything to localStorage
	Save();
}

/*
This function builds ONE todo item in HTML
It matches this structure:

<div class="item">
	<input type="checkbox" />
	<input type="text" disabled />
	<div class="actions">
		<button>edit</button>
		<button>remove</button>
	</div>
</div>
*/
function CreateTodoElement(item) {

	// Main todo container
	const item_el = document.createElement("div");
	item_el.classList.add("item");

	// Checkbox for completed / not completed
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = item.complete;

	// If todo is completed, add the class
	if (item.complete) {
		item_el.classList.add("complete");
	}

	// Text input for the todo content
	const input_el = document.createElement("input");
	input_el.type = "text";
	input_el.value = item.text;
	input_el.setAttribute("disabled", ""); // Locked by default

	// Container for edit + delete buttons
	const actions_el = document.createElement("div");
	actions_el.classList.add("actions");

	// Edit button
	const edit_btn_el = document.createElement("button");
	edit_btn_el.classList.add("material-icons");
	edit_btn_el.innerText = "edit";

	// Delete button
	const remove_btn_el = document.createElement("button");
	remove_btn_el.classList.add("material-icons", "remove-btn");
	remove_btn_el.innerText = "remove_circle";

	// Put buttons inside actions div
	actions_el.append(edit_btn_el);
	actions_el.append(remove_btn_el);

	// Put everything inside the todo item
	item_el.append(checkbox);
	item_el.append(input_el);
	item_el.append(actions_el);

	// =====================
	// EVENT LISTENERS
	// =====================

	// When checkbox is clicked
	checkbox.addEventListener("change", () => {
		item.complete = checkbox.checked;

		// Add or remove completed styling
		if (item.complete) {
			item_el.classList.add("complete");
		} else {
			item_el.classList.remove("complete");
		}

		Save();
	});

	// While typing in the input
	input_el.addEventListener("input", () => {
		item.text = input_el.value; // Update todo text
	});

	// When input loses focus (click away)
	input_el.addEventListener("blur", () => {
		input_el.setAttribute("disabled", ""); // Lock editing
		Save();
	});

	// When edit button is clicked
	edit_btn_el.addEventListener("click", () => {
		input_el.removeAttribute("disabled"); // Unlock input
		input_el.focus();                      // Start typing
	});

	// When delete button is clicked
	remove_btn_el.addEventListener("click", () => {
		// Remove todo from array
		todos = todos.filter(t => t.id != item.id);

		// Remove todo from the page
		item_el.remove();

		Save();
	});

	// Send back useful elements
	return { item_el, input_el, edit_btn_el, remove_btn_el }
}

// Load todos and display them on page load
function DisplayTodos() {
	Load();

	// Loop through saved todos
	for (let i = 0; i < todos.length; i++) {
		const item = todos[i];

		// Create HTML for each todo
		const { item_el } = CreateTodoElement(item);

		// Add it to the list
		list_el.append(item_el);
	}
}

// Run this as soon as the page loads
DisplayTodos();

// Save todos to localStorage
function Save() {
	const save = JSON.stringify(todos); // Convert to text
	
	localStorage.setItem("my_todos", save);
}

// Load todos from localStorage
function Load() {
	const data = localStorage.getItem("my_todos");

	if (data) {
		todos = JSON.parse(data); // Convert back to array
	}
}
