// main.js - Main UI logic for CPU Scheduling Simulator

function generateInputs() {
    let n = parseInt(document.getElementById("numProcesses").value, 10) || 0;
    if (n < 3) {
        alert("Please enter at least 3 processes.");
        document.getElementById("numProcesses").value = 3;
        n = 3;
    }
    let container = document.getElementById("processInputs");
    container.innerHTML = "";

    for (let i = 0; i < n; i++) {
        container.innerHTML += `
            <div>
                <b>P${i + 1}</b>
                ProcessName: <input type="text" id="pn${i}" value="P${i + 1}">
                Arrival: <input type="number" id="at${i}" value="0" min="0">
                Burst: <input type="number" id="bt${i}" value="1" min="0">
                <span id="priority${i}">Priority: <input type="number" id="pr${i}" value="${i + 1}" min="0"></span>
            </div>
        `;
    }
    updateVisibility();
}

function updateVisibility() {
    // Show or hide inputs depending on the selected scheduling algorithm.
    let algo = document.getElementById("algorithm").value;
    let quantumLabel = document.getElementById("quantumLabel");
    let quantumInput = document.getElementById("quantum");

    if (algo === "rr" || algo === "prio_rr") {
        quantumLabel.style.display = "inline";
        quantumInput.style.display = "inline";
    } else {
        quantumLabel.style.display = "none";
        quantumInput.style.display = "none";
    }

    // Show/hide priority inputs only for priority-based algorithms
    let n = parseInt(document.getElementById("numProcesses").value, 10) || 0;
    let showPriority = (algo === "prio" || algo === "prio_rr");

    for (let i = 0; i < n; i++) {
        let prioritySpan = document.getElementById("priority" + i);
        if (prioritySpan) {
            prioritySpan.style.display = showPriority ? "inline" : "none";
        }
    }

    let priorityNote = document.getElementById("priorityNote");
    if (priorityNote) {
        priorityNote.style.display = showPriority ? "block" : "none";
    }

    // Update table header
    updateTableHeader(algo);
}

function runSimulation() {
    let n = parseInt(document.getElementById("numProcesses").value, 10) || 0;
    if (n < 3) {
        alert("Please use at least 3 processes before running the simulation.");
        return;
    }
    let algo = document.getElementById("algorithm").value;

    for (let i = 0; i < n; i++) {
        let pn = document.getElementById("pn" + i).value.trim();
        let at = parseInt(document.getElementById("at" + i).value, 10);
        let bt = parseInt(document.getElementById("bt" + i).value, 10);
        let prInput = document.getElementById("pr" + i);
        let pr = prInput ? parseInt(prInput.value, 10) : 0;

        if (pn === "") {
            alert(`Please provide a name for process ${i + 1}.`);
            return;
        }
        if (isNaN(at) || at < 0) {
            alert(`Arrival time for process ${i + 1} must be 0 or higher.`);
            return;
        }
        if (isNaN(bt) || bt < 0) {
            alert(`Burst time for process ${i + 1} must be 0 or higher.`);
            return;
        }
        if (prInput && (isNaN(pr) || pr < 0)) {
            alert(`Priority for process ${i + 1} must be 0 or higher.`);
            return;
        }
    }

    if ((algo === "rr" || algo === "prio_rr")) {
        let quantum = parseInt(document.getElementById("quantum").value, 10);
        if (isNaN(quantum) || quantum < 1) {
            alert("Time quantum must be a positive integer of 1 or higher.");
            return;
        }
    }

    // Run the selected scheduling algorithm and draw the results.
    if (algo === "fcfs") {
        fcfs();
    } else if (algo === "sjf") {
        sjf();
    } else if (algo === "srt") {
        srt();
    } else if (algo === "rr") {
        rr();
    } else if (algo === "prio") {
        priority();
    } else if (algo === "prio_rr") {
        priorityRR();
    } else {
        alert("Algorithm not implemented yet.");
    }
}

document.addEventListener("DOMContentLoaded", generateInputs);
