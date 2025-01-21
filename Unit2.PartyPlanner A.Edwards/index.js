const API_URL = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2410-FTB-ET-WED-AM/events";

// Establishing the state
const state = {
  parties: [],
};

// Select DOM elements
const partyList = document.querySelector("#party");
const addPartyForm = document.querySelector("#addParty");

// Event listeners
addPartyForm.addEventListener("submit", addParty);

// Initial render
async function render() {
  await getParties();
  renderParties();
}

render();

// Fetch existing parties from the API
async function getParties() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    state.parties = data.data; // Store fetched parties into the state
    console.log("Fetched parties:", state.parties);
  } catch (error) {
    console.error("Error fetching parties:", error);
  }
}

// Render party list
function renderParties() {
  // Clear the current party list before rendering
  partyList.innerHTML = "";

  if (!state.parties.length) {
    partyList.innerHTML = `<li>No events found.</li>`;
    return;
  }

  // Create a list of party cards
  state.parties.forEach((party) => {
    const eventCard = document.createElement("li");
    eventCard.classList.add("party");
    eventCard.innerHTML = `
      <h4>${party.name}</h4>
      <h5>${party.date}</h5>
      <h5>${party.time}</h5>
      <h5>${party.location}</h5>
      <p>${party.description}</p>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    eventCard.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteEvent(party.id));

    partyList.appendChild(eventCard);
  });
  console.log("Rendered parties:", state.parties);
}

// Handle form submission for adding a party
async function addParty(event) {
  event.preventDefault();

  const name = addPartyForm.partyName.value;
  const date = addPartyForm.partyDate.value;
  const time = addPartyForm.partyTime.value;
  const location = addPartyForm.partyLocation.value;
  const description = addPartyForm.partyDescription.value;

  await createNewEvent(name, date, time, location, description);
}

// Send POST request to create a new party event
async function createNewEvent(name, date, time, location, description) {
  try {
    const newEvent = {
      name,
      date,
      time,
      location,
      description,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });

    if (!response.ok) {
      throw new Error(`Failed to create event: ${response.statusText}`);
    }

    const json = await response.json();
    console.log("Event created successfully:", json);

    // Refresh the list of parties after creating a new one
    await getParties();
    renderParties();
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

// Delete an event
async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete event: ${response.statusText}`);
    }

    const json = await response.json();
    console.log("Event deleted successfully:", json);

    // After deletion, refresh the list of parties
    await getParties();
    renderParties();
  } catch (error) {
    console.error("Error deleting event:", error);
  }
}
