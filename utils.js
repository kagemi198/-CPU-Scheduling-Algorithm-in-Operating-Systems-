// utils.js - Utility functions for CPU Scheduling Simulator

function createScheduleSegment(schedule, pid, start, end) {
    // Add or merge a segment into the schedule, keeping adjacent same-process blocks together.
    if (start >= end) return;
    if (schedule.length && schedule[schedule.length - 1].pid === pid && schedule[schedule.length - 1].end === start) {
        schedule[schedule.length - 1].end = end;
    } else {
        schedule.push({ pid, start, end });
    }
}

function getProcessInputs() {
    let n = parseInt(document.getElementById("numProcesses").value, 10);
    let processes = [];

    for (let i = 0; i < n; i++) {
        processes.push({
            id: "P" + (i + 1),
            pn: document.getElementById("pn" + i).value,
            at: parseInt(document.getElementById("at" + i).value, 10),
            bt: parseInt(document.getElementById("bt" + i).value, 10),
            pr: parseInt(document.getElementById("pr" + i).value, 10),
            remaining: parseInt(document.getElementById("bt" + i).value, 10),
            completionTime: 0,
            responseTime: -1,
            done: false
        });
    }

    return processes;
}

function getTimeQuantum() {
    return parseInt(document.getElementById("quantum").value, 10);
}

function updateTableHeader(algo) {
    let priorityHeader = document.getElementById("priorityHeader");
    if (algo === "prio" || algo === "prio_rr") {
        priorityHeader.style.display = "table-cell";
    } else {
        priorityHeader.style.display = "none";
    }
}

function displayResults(processes, wt, tat, rt, schedule) {
    let ganttDiv = document.getElementById("gantt");
    let labelsDiv = document.getElementById("ganttLabels");
    ganttDiv.innerHTML = "";
    labelsDiv.innerHTML = "";

    let totalWT = 0;
    let totalTAT = 0;
    let totalRT = 0;
    let n = processes.length;
    let algo = document.getElementById("algorithm").value;
    let showPriority = (algo === "prio" || algo === "prio_rr");

    const palette = ['#dc2626', '#2563eb', '#eab308', '#16a34a'];
    const colors = {};
    let nextColorIndex = 0;
    schedule.forEach(segment => {
        if (!colors[segment.pid]) {
            colors[segment.pid] = segment.pid === 'Idle' ? '#d1d5db' : palette[nextColorIndex % palette.length];
            nextColorIndex++;
        }
        const block = document.createElement('div');
        block.className = 'gantt-segment';
        block.style.flex = `${segment.end - segment.start}`;
        block.style.background = colors[segment.pid];
        block.innerHTML = `<span class="segment-label">${segment.pid}</span>`;
        ganttDiv.appendChild(block);

        const timeLabel = document.createElement('span');
        timeLabel.style.flex = `${segment.end - segment.start}`;
        timeLabel.textContent = segment.start;
        labelsDiv.appendChild(timeLabel);
    });

    if (schedule.length > 0) {
        const lastLabel = document.createElement('span');
        lastLabel.textContent = schedule[schedule.length - 1].end;
        lastLabel.style.flex = '0';
        labelsDiv.appendChild(lastLabel);
    }

    let tbody = document.querySelector("#resultTable tbody");
    tbody.innerHTML = "";

    processes.forEach((p, i) => {
        totalWT += wt[i];
        totalTAT += tat[i];
        totalRT += rt[i];

        let priorityCell = showPriority ? `<td>${p.pr}</td>` : '';

        tbody.innerHTML += `
            <tr>
                <td>${p.pn}</td>
                <td>${p.at}</td>
                <td>${p.bt}</td>
                ${priorityCell}
                <td>${wt[i]}</td>
                <td>${tat[i]}</td>
                <td>${rt[i]}</td>
            </tr>
        `;
    });

    let avgWT = totalWT / n;
    let avgTAT = totalTAT / n;
    let avgRT = totalRT / n;

    document.getElementById("averages").innerText =
        `Average WT: ${avgWT.toFixed(2)} | Average TAT: ${avgTAT.toFixed(2)} | Average RT: ${avgRT.toFixed(2)}`;
}