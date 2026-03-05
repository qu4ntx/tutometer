// Function to fetch a CSV file from GitHub
async function fetchCSV(url) {
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

// Function to parse the sessions CSV data
function parseSessionsCSV(data) {
    if (!data) {
        console.error('No data to parse.');
        return { sessionsDone: [], sessionsPaid: [], sessionEvents: [] };
    }

    const lines = data.trim().split('\n').slice(1); // Skip header line
    const sessionsDone = [];
    const sessionsPaid = [];
    const sessionEvents = [];

    lines.forEach(line => {
        const parts = line.split(',');
        let date = '';
        let time = '';
        let done = '0';
        let paid = '0';

        // Support both 4-column rows and legacy 3-column rows without a time field.
        if (parts.length >= 4) {
            [date, time, done, paid] = parts;
        } else if (parts.length === 3) {
            [date, done, paid] = parts;
        } else {
            return;
        }

        const doneValue = parseFloat(done) || 0;
        const paidValue = parseFloat(paid) || 0;

        if (doneValue > 0) {
            sessionsDone.push({ date, time, sessions: doneValue });
        }
        if (paidValue > 0) {
            sessionsPaid.push({ date, time, sessions: paidValue });
        }
        if (doneValue > 0 || paidValue > 0) {
            sessionEvents.push({ date, time, done: doneValue, paid: paidValue });
        }
    });

    return { sessionsDone, sessionsPaid, sessionEvents };
}

// Function to parse the topics CSV data
function parseTopicsCSV(data) {
    if (!data) {
        console.error('No data to parse.');
        return [];
    }

    const lines = data.trim().split('\n').slice(1); // Skip header line
    const topics = [];

    lines.forEach(line => {
        const [date, topic] = line.split(',');
        topics.push({ date, topic });
    });

    console.log('Parsed Topics:', topics); // Log the parsed topics to the console
    return topics;
}

// Function to update the display
function updateDisplay(sessionsDone, sessionsPaid, sessionEvents) {
    let totalDone = sessionsDone.reduce((sum, session) => sum + session.sessions, 0);
    let totalPaid = sessionsPaid.reduce((sum, payment) => sum + payment.sessions, 0);

    if (totalDone > totalPaid) {
        totalDone = totalDone - totalPaid;
        totalPaid = 0;
    } else {
        totalDone = totalDone - totalPaid + 10;
        totalPaid = 10;
    }

    document.getElementById('sessions-done').textContent = totalDone.toFixed(1); // Display with 1 decimal place
    document.getElementById('sessions-paid').textContent = totalPaid.toFixed(1); // Display with 1 decimal place
    document.getElementById('progress').textContent = `${totalDone.toFixed(1)}/${totalPaid.toFixed(1)}`;

    updateHistory(sessionEvents);
}

// Function to update the session history list
function updateHistory(sessionEvents) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = ''; // Clear existing list
    let paidCredit = 0;

    sessionEvents.forEach(event => {
        const timestamp = event.time ? `${event.date} ${event.time}` : event.date;

        if (event.paid > 0) {
            paidCredit += event.paid;
            const paymentItem = document.createElement('li');
            paymentItem.textContent = `Paid for: ${timestamp}, ${event.paid.toFixed(1)} session${event.paid > 1 ? 's' : ''}`;
            paymentItem.classList.add('paid');
            historyList.appendChild(paymentItem);
        }

        if (event.done > 0) {
            const coveredSessions = Math.min(event.done, paidCredit);
            const unpaidSessions = event.done - coveredSessions;
            paidCredit -= coveredSessions;

            const sessionItem = document.createElement('li');
            sessionItem.classList.add('completed');

            if (unpaidSessions > 0) {
                sessionItem.textContent = `Completed: ${timestamp}, ${event.done.toFixed(1)} session${event.done > 1 ? 's' : ''} (${unpaidSessions.toFixed(1)} unpaid)`;
                sessionItem.classList.add('unpaid');
            } else {
                sessionItem.textContent = `Completed: ${timestamp}, ${event.done.toFixed(1)} session${event.done > 1 ? 's' : ''} (paid)`;
            }

            historyList.appendChild(sessionItem);
        }
    });
}

// Function to update the topics covered list
function updateTopicsList(topics) {
    const topicsList = document.getElementById('topics-list');
    topicsList.innerHTML = ''; // Clear existing list

    if (topics.length === 0) {
        topicsList.innerHTML = '<li>No topics covered yet.</li>';
    } else {
        topics.forEach(topic => {
            const li = document.createElement('li');
            li.textContent = `${topic.date}: ${topic.topic}`;
            topicsList.appendChild(li);
        });
    }
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
    // Load CSV files from the same repo/site path so forks and GitHub Pages work.
    const sessionsCSVUrl = 'sessions.csv';
    const topicsCSVUrl = 'topics.csv';

    const sessionsCSVData = await fetchCSV(sessionsCSVUrl);
    const topicsCSVData = await fetchCSV(topicsCSVUrl);

    if (sessionsCSVData) {
        const { sessionsDone, sessionsPaid, sessionEvents } = parseSessionsCSV(sessionsCSVData);
        updateDisplay(sessionsDone, sessionsPaid, sessionEvents);
    } else {
        console.error('Failed to load sessions CSV data.');
    }

    if (topicsCSVData) {
        const topics = parseTopicsCSV(topicsCSVData);
        updateTopicsList(topics);
    } else {
        console.error('Failed to load topics CSV data.');
    }
}

// Run the main function when the page loads
main();

// Set the default tab to open
document.getElementById("defaultOpen").click();
