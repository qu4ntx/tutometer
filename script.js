// Store sessions locally
let sessions = [];

// Add session to the list
document.getElementById('session-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const date = document.getElementById('date').value;
    const hours = parseFloat(document.getElementById('hours').value);
    const rate = parseFloat(document.getElementById('rate').value);
    const paid = parseFloat(document.getElementById('paid').value);

    const session = {
        date,
        hours,
        rate,
        paid,
        totalEarned: hours * rate
    };

    sessions.push(session);
    updateSessionList();
    updateBalance();
    this.reset(); // Clear the form
});

// Update the session list in the UI
function updateSessionList() {
    const sessionList = document.getElementById('session-list');
    sessionList.innerHTML = ''; // Clear the list

    sessions.forEach(session => {
        const li = document.createElement('li');
        li.textContent = `${session.date} - ${session.hours} hours at $${session.rate}/hour - Paid: $${session.paid}`;
        sessionList.appendChild(li);
    });
}

// Update the balance due in the UI
function updateBalance() {
    const balance = sessions.reduce((total, session) => total + session.totalEarned - session.paid, 0);
    document.getElementById('balance').textContent = `$${balance.toFixed(2)}`;
}
