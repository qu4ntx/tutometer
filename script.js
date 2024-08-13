// Initialize storage (simulating a backend)
if (!localStorage.getItem('sessionsDone')) {
    localStorage.setItem('sessionsDone', JSON.stringify([]));
}
if (!localStorage.getItem('sessionsPaid')) {
    localStorage.setItem('sessionsPaid', JSON.stringify([]));
}

// Function to get and parse data from local storage
function getData(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Function to update the displayed data
function updateDisplay() {
    const sessionsDone = getData('sessionsDone').length;
    const sessionsPaid = getData('sessionsPaid').length;

    document.getElementById('sessions-done').textContent = sessionsDone;
    document.getElementById('sessions-paid').textContent = sessionsPaid;
    document.getElementById('progress').textContent = `${sessionsDone}/${sessionsPaid}`;

    updateHistory();
}

// Function to update the session history list
function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Clear existing list

    const sessionsDone = getData('sessionsDone');
    const sessionsPaid = getData('sessionsPaid');

    sessionsDone.forEach(session => {
        const li = document.createElement('li');
        li.textContent = `Completed: ${session.dateTime}, ${session.sessions} sessions`;
        historyList.appendChild(li);
    });

    sessionsPaid.forEach(payment => {
        const li = document.createElement('li');
        li.textContent = `Paid for: ${payment.dateTime}, ${payment.sessions} sessions`;
        historyList.appendChild(li);
    });
}

// Example functions to simulate adding sessions and payments
function addSession() {
    const sessionsDone = getData('sessionsDone');
    const newSession = {
        dateTime: new Date().toLocaleString(),
        sessions: 1 // Assuming each session is 1 hour
    };
    sessionsDone.push(newSession);
    localStorage.setItem('sessionsDone', JSON.stringify(sessionsDone));
    updateDisplay();
}

function addPayment() {
    const sessionsPaid = getData('sessionsPaid');
    const newPayment = {
        dateTime: new Date().toLocaleString(),
        sessions: 10 // Each payment covers 10 sessions
    };
    sessionsPaid.push(newPayment);
    localStorage.setItem('sessionsPaid', JSON.stringify(sessionsPaid));
    updateDisplay();
}

// Initialize display
updateDisplay();

// For demonstration purposes, you can manually call addSession() and addPayment()
// to simulate adding sessions and payments. In a real scenario, these would be called
// from specific user actions or backend events.

// Example usage
// Uncomment these to simulate adding sessions or payments
// addSession(); // Simulate adding one session completed
// addPayment(); // Simulate adding a payment for 10 sessions

