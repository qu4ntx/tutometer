// Function to fetch the CSV file from GitHub
async function fetchCSV() {
    const url = 'https://raw.githubusercontent.com/qu4ntx/your-repository-name/main/sessions.csv';
    
    const response = await fetch(url);
    const data = await response.text();
    return data;
}

// Function to parse CSV data
function parseCSV(data) {
    const lines = data.split('\n').slice(1); // Skip header line
    const sessionsDone = [];
    const sessionsPaid = [];

    lines.forEach(line => {
        const [date, time, done, paid] = line.split(',');
        if (done > 0) {
            sessionsDone.push({ date, time, sessions: parseInt(done) });
        }
        if (paid > 0) {
            sessionsPaid.push({ date, time, sessions: parseInt(paid) });
        }
    });

    return { sessionsDone, sessionsPaid };
}

// Function to update the display
function updateDisplay(sessionsDone, sessionsPaid) {
    const totalDone = sessionsDone.reduce((sum, session) => sum + session.sessions, 0);
    const totalPaid = sessionsPaid.reduce((sum, payment) => sum + payment.sessions, 0);

    document.getElementById('sessions-done').textContent = totalDone;
    document.getElementById('sessions-paid').textContent = totalPaid;
    document.getElementById('progress').textContent = `${totalDone}/${totalPaid}`;

    updateHistory(sessionsDone, sessionsPaid);
}

// Function to update the history list
function updateHistory(sessionsDone, sessionsPaid) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Clear existing list

    sessionsDone.forEach(session => {
        const li = document.createElement('li');
        li.textContent = `Completed: ${session.date} ${session.time}, ${session.sessions} sessions`;
        historyList.appendChild(li);
    });

    sessionsPaid.forEach(payment => {
        const li = document.createElement('li');
        li.textContent = `Paid for: ${payment.date} ${payment.time}, ${payment.sessions} sessions`;
        historyList.appendChild(li);
    });
}

// Main function to fetch, parse, and display data
async function main() {
    const csvData = await fetchCSV();
    const { sessionsDone, sessionsPaid } = parseCSV(csvData);
    updateDisplay(sessionsDone, sessionsPaid);
}

// Run the main function when the page loads
main();


