// Function to fetch a CSV file from GitHub
async function fetchCSV(url) {
    try {
        const response = await fetch(url);

        // Check if the response is okay (status code 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.text();
        return data;
    } catch (error) {
        console.error('Error fetching the CSV file:', error);
        return null;
    }
}

// Function to parse the sessions CSV data
function parseSessionsCSV(data) {
    if (!data) {
        return { sessionsDone: [], sessionsPaid: [] };
    }

    const lines = data.trim().split('\n').slice(1); // Skip header line
    const sessionsDone = [];
    const sessionsPaid = [];

    lines.forEach(line => {
        const [date, time, done, paid] = line.split(',');

        if (parseInt(done) > 0) {
            sessionsDone.push({ date, time, sessions: parseFloat(done) });
        }
        if (parseInt(paid) > 0) {
            sessionsPaid.push({ date, time, sessions: parseFloat(paid) });
        }
    });

    return { sessionsDone, sessionsPaid };
}

// Function to update the session history list
function updateHistory(sessionsDone, sessionsPaid) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Clear existing list

    // Combine the completed and paid sessions into one array
    const combinedSessions = [...sessionsDone.map(session => ({
        type: 'completed',
        date: session.date,
        time: session.time,
        sessions: session.sessions
    })), ...sessionsPaid.map(payment => ({
        type: 'paid',
        date: payment.date,
        time: payment.time,
        sessions: payment.sessions
    }))];

    // Sort the combined array by date and time
    combinedSessions.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
    });

    // Render the sorted sessions
    combinedSessions.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.type === 'completed' ? 'Completed' : 'Paid for'}: ${entry.date} ${entry.time}, ${entry.sessions.toFixed(1)} session${entry.sessions > 1 ? 's' : ''}`;
        li.classList.add(entry.type); // Add 'completed' or 'paid' class
        historyList.appendChild(li);
    });
}

// Tab functionality
function openTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Main function to fetch, parse, and display data
async function main() {
    const sessionsCSVUrl = 'https://raw.githubusercontent.com/qu4ntx/tutometer/main/sessions.csv';
    const topicsCSVUrl = 'https://raw.githubusercontent.com/qu4ntx/tutometer/main/topics.csv';

    const sessionsCSVData = await fetchCSV(sessionsCSVUrl);

    if (sessionsCSVData) {
        const { sessionsDone, sessionsPaid } = parseSessionsCSV(sessionsCSVData);
        updateHistory(sessionsDone, sessionsPaid);
    } else {
        console.error('Failed to load sessions CSV data.');
    }
}

// Run the main function when the page loads
main();

// Set the default tab to open
document.getElementById("defaultOpen").click();
