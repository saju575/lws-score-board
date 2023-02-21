let scorebord = 1;
//actions identifies

const INCREMENT = "increment";
const DECREMENT = "decrement";
const ADD_MATCH = "addmatch";
const SET_TO_ZERO = "settozero";
const REMOVE_MATCH = "remove_match";

//actions creators

const increment = (value, id) => ({
  id,
  type: INCREMENT,
  payload: value,
});

const decrement = (value, id) => ({
  id,
  type: DECREMENT,
  payload: value,
});

const addMatchAction = (value, id) => ({
  id,
  type: ADD_MATCH,
  payload: value,
});

const setToZeroAction = (value) => ({
  type: SET_TO_ZERO,
  payload: value,
});

const removeMatchAction = (id) => ({ id, type: REMOVE_MATCH });

//initial state

let initialState = [{ id: "1", count: 0 }];

//reducer function

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case INCREMENT:
      return state.map((item) => {
        if (item.id === action.id) {
          return { ...item, count: item.count + action.payload };
        } else {
          return item;
        }
      });
    case DECREMENT:
      return state.map((item) => {
        if (item.id === action.id) {
          return {
            ...item,
            count:
              item.count - action.payload < 0 ? 0 : item.count - action.payload,
          };
        } else {
          return item;
        }
      });
    case ADD_MATCH:
      return [...state, { id: action.id, count: action.payload }];

    case SET_TO_ZERO:
      return state.map((item) => ({ ...item, count: 0 }));

    case REMOVE_MATCH:
      return state.filter((item) => item.id !== action.id);

    default:
      return state;
  }
};

//create store
const store = Redux.createStore(counterReducer);

//render function

const render = () => {
  const state = store.getState();
  const counterEl = document.querySelectorAll(".lws-singleResult");
  for (let i = 0; i < counterEl.length; i++) {
    counterEl[i].innerText = state[i].count;
  }
};
render();
//subscribe to the state change
store.subscribe(render);

//Now work with the dom elements

// increment function

function incrementValue(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const value = parseInt(e.target.value);
    const dataValue = e.target.getAttribute("data-value");
    store.dispatch(increment(value, dataValue));
  }
}

//decrement function
function decrementValue(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const value = parseInt(e.target.value);
    const dataValue = e.target.getAttribute("data-value");
    store.dispatch(decrement(value, dataValue));
  }
}
//onfocus function

const onFocus = (e) => {
  e.preventDefault();
  e.target.value = "";
};

//remove match item function

const removeMatch = (item, id) => {
  item.remove();
  store.dispatch(removeMatchAction(id));
};
// remove match item function for the first match (match1)
const removeFirstMatch = () => {
  const match1 = document.querySelector(".match");
  removeMatch(match1, "1");
};

// Add an event listener to the "Add Another Match" button

const container = document.getElementById("allMatches");

// Create a function that will be triggered when the "Add Another Match" button is clicked
function addMatch() {
  // Create a new div element
  const matchDiv = document.createElement("div");
  // Give the div the class "match"
  matchDiv.className = "match";
  scorebord = scorebord + 1;
  // Add the HTML for the new match to the div
  matchDiv.innerHTML = `
    <div class="wrapper">
      <button class="lws-delete">
        <img src="./image/delete.svg" alt="" />
      </button>
      <h3 class="lws-matchName">Match ${scorebord}</h3>
    </div>
    <div class="inc-dec">
      <form class="incrementForm">
        <h4>Increment</h4>
        <input
          type="number"
          name="increment"
          class="lws-increment"
        />
      </form>
      <form class="decrementForm">
        <h4>Decrement</h4>
        <input
          type="number"
          name="decrement"
          class="lws-decrement"
        />
      </form>
    </div>
    <div class="numbers">
      <h2 class="lws-singleResult">120</h2>
    </div>
  `;

  // Append the new div to the container
  container.appendChild(matchDiv);
  //genarate unique id
  const uniqueId =
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  store.dispatch(addMatchAction(0, uniqueId));
  //get the form input element reference

  const incrementElement = matchDiv.querySelector(".lws-increment");
  const decrementElement = matchDiv.querySelector(".lws-decrement");

  //delete button reference
  const deleteBtn = matchDiv.querySelector(".lws-delete");
  //set data-value attribute to the form input element
  incrementElement.setAttribute("data-value", uniqueId);
  decrementElement.setAttribute("data-value", uniqueId);
  //add onclick handler in delete button
  deleteBtn.onclick = () => {
    removeMatch(matchDiv, uniqueId);
  };
  //add onkeydown handler to input element for increment and decrement operations
  incrementElement.onkeypress = incrementValue;
  decrementElement.onkeypress = decrementValue;

  //add onfocus handler to input element for clear input fields
  incrementElement.onfocus = onFocus;
  decrementElement.onfocus = onFocus;
}

// Get the "Add Another Match" button
const btn = document.querySelector(".lws-addMatch");

// Add an event listener to the button that will trigger the addMatch function when clicked
btn.addEventListener("click", addMatch);

//Get reset button reference

const resetBtn = document.querySelector(".lws-reset");

// Add an event listener to the reset button that will trigger the reset function when clicked
resetBtn.addEventListener("click", () => {
  store.dispatch(setToZeroAction(0));
  const inputField = container.querySelectorAll("input");
  for (let i = 0; i < inputField.length; i++) {
    inputField[i].value = "";
  }
});
