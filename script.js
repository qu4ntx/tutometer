// Function to fetch the CSV file from GitHub
async function fetchCSV() {
    const url = 'https://raw.githubusercontent.com/qu4ntx/tutometer/main/sessions.csv';
    
    try {
        const response = await fetch(url);

        // Check if the response is okay (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();
        console.log('CSV Data:', data); // Log the CSV data to the console
        return data;
    } catch (error) {
        console.error('Error fetching the CSV file:', error);
        return null;
    }
}

// Function to parse CSV data
function parseCSV(data) {
    if (!data) {
        console.error('No data to parse.');
        return { sessionsDone: [], sessionsPaid: [] };
    }

    const lines = data.trim().split('\n').slice(1); // Skip header line
    const sessionsDone = [];
    const sessionsPaid = [];

    lines.forEach(line => {
        const [date, time, done, paid] = line.split(',');

        if (parseInt(done) > 0) {
            sessionsDone.push({ date, time, sessions: parseInt(done) });
        }
        if (parseInt(paid) > 0) {
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

// Function to update the session history list
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
    if (csvData) {
        const { sessionsDone, sessionsPaid } = parseCSV(csvData);
        updateDisplay(session



