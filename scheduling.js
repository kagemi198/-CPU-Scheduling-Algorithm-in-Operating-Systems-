// scheduling.js - CPU Scheduling Algorithms

function fcfs() {
    let n = document.getElementById("numProcesses").value;

    let processes = [];
    for (let i = 0; i < n; i++) {
        processes.push({
            id: "P" + (i + 1),
            pn: document.getElementById("pn" + i).value,
            at: parseInt(document.getElementById("at" + i).value),
            bt: parseInt(document.getElementById("bt" + i).value),
            pr: parseInt(document.getElementById("pr" + i).value),
            remaining: parseInt(document.getElementById("bt" + i).value),
            completionTime: 0,
            responseTime: 0
        });
    }

    processes.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
    let time = 0;
    let schedule = [];
    let wt = [];
    let tat = [];
    let rt = [];

    processes.forEach((p, i) => {
        if (time < p.at) {
            createScheduleSegment(schedule, 'Idle', time, p.at);
            time = p.at;
        }
        p.responseTime = time - p.at;
        p.completionTime = time + p.bt;
        wt[i] = time - p.at;
        tat[i] = p.completionTime - p.at;
        rt[i] = p.responseTime;
        createScheduleSegment(schedule, p.pn, time, p.completionTime);
        time = p.completionTime;
    });

    displayResults(processes, wt, tat, rt, schedule);
}

function sjf() {
    let n = document.getElementById("numProcesses").value;
    let processes = [];

    for (let i = 0; i < n; i++) {
        processes.push({
            id: "P" + (i + 1),
            pn: document.getElementById("pn" + i).value,
            at: parseInt(document.getElementById("at" + i).value),
            bt: parseInt(document.getElementById("bt" + i).value),
            pr: parseInt(document.getElementById("pr" + i).value),
            remaining: parseInt(document.getElementById("bt" + i).value),
            completionTime: 0,
            responseTime: -1,
            done: false
        });
    }

    let time = 0;
    let completed = 0;
    let schedule = [];
    let wt = [];
    let tat = [];
    let rt = [];

    while (completed < n) {
        let ready = processes.filter(p => p.at <= time && !p.done);
        if (ready.length === 0) {
            let nextArrival = Math.min(...processes.filter(p => !p.done).map(p => p.at));
            createScheduleSegment(schedule, 'Idle', time, nextArrival);
            time = nextArrival;
            continue;
        }

        ready.sort((a, b) => a.bt - b.bt || a.at - b.at || a.id.localeCompare(b.id));
        let current = ready[0];
        if (current.responseTime === -1) {
            current.responseTime = time - current.at;
        }
        current.completionTime = time + current.bt;
        createScheduleSegment(schedule, current.pn, time, current.completionTime);
        time = current.completionTime;
        current.done = true;
        completed++;
        let index = processes.findIndex(p => p.id === current.id);
        wt[index] = current.completionTime - current.at - current.bt;
        tat[index] = current.completionTime - current.at;
        rt[index] = current.responseTime;
    }

    displayResults(processes, wt, tat, rt, schedule);
}

function srt() {
    let n = document.getElementById("numProcesses").value;
    let processes = [];

    for (let i = 0; i < n; i++) {
        processes.push({
            id: "P" + (i + 1),
            pn: document.getElementById("pn" + i).value,
            at: parseInt(document.getElementById("at" + i).value),
            bt: parseInt(document.getElementById("bt" + i).value),
            pr: parseInt(document.getElementById("pr" + i).value),
            remaining: parseInt(document.getElementById("bt" + i).value),
            completionTime: 0,
            responseTime: -1,
            done: false
        });
    }

    let time = 0;
    let completed = 0;
    let schedule = [];
    let wt = [];
    let tat = [];
    let rt = [];

    while (completed < n) {
        let ready = processes.filter(p => p.at <= time && !p.done);
        if (ready.length === 0) {
            let nextArrival = Math.min(...processes.filter(p => !p.done).map(p => p.at));
            createScheduleSegment(schedule, 'Idle', time, nextArrival);
            time = nextArrival;
            continue;
        }

        ready.sort((a, b) => a.remaining - b.remaining || a.at - b.at || a.id.localeCompare(b.id));
        let current = ready[0];
        if (current.responseTime === -1) {
            current.responseTime = time - current.at;
        }
        createScheduleSegment(schedule, current.pn, time, time + 1);
        time += 1;
        current.remaining -= 1;

        if (current.remaining === 0) {
            current.completionTime = time;
            current.done = true;
            completed++;
            let index = processes.findIndex(p => p.id === current.id);
            wt[index] = current.completionTime - current.at - current.bt;
            tat[index] = current.completionTime - current.at;
            rt[index] = current.responseTime;
        }
    }

    displayResults(processes, wt, tat, rt, schedule);
}

function rr() {
    let n = document.getElementById("numProcesses").value;
    let quantum = parseInt(document.getElementById("quantum").value);
    let processes = [];

    for (let i = 0; i < n; i++) {
        processes.push({
            id: "P" + (i + 1),
            pn: document.getElementById("pn" + i).value,
            at: parseInt(document.getElementById("at" + i).value),
            bt: parseInt(document.getElementById("bt" + i).value),
            pr: parseInt(document.getElementById("pr" + i).value),
            remaining: parseInt(document.getElementById("bt" + i).value),
            completionTime: 0,
            responseTime: -1,
            done: false
        });
    }

    let time = 0;
    let queue = [];
    let schedule = [];
    let wt = [];
    let tat = [];
    let rt = [];
    let completed = 0;
    let index = 0;

    while (completed < n) {
        while (index < n && processes[index].at <= time) {
            queue.push(processes[index]);
            index++;
        }

        if (queue.length === 0) {
            let nextArrival = Math.min(...processes.filter(p => !p.done).map(p => p.at));
            createScheduleSegment(schedule, 'Idle', time, nextArrival);
            time = nextArrival;
            continue;
        }

        let current = queue.shift();
        if (current.responseTime === -1) {
            current.responseTime = time - current.at;
        }

        let executeTime = Math.min(quantum, current.remaining);
        createScheduleSegment(schedule, current.pn, time, time + executeTime);
        time += executeTime;
        current.remaining -= executeTime;

        while (index < n && processes[index].at <= time) {
            queue.push(processes[index]);
            index++;
        }

        if (current.remaining > 0) {
            queue.push(current);
        } else {
            current.completionTime = time;
            current.done = true;
            completed++;
            let idx = processes.findIndex(p => p.id === current.id);
            wt[idx] = current.completionTime - current.at - current.bt;
            tat[idx] = current.completionTime - current.at;
            rt[idx] = current.responseTime;
        }
    }

    displayResults(processes, wt, tat, rt, schedule);
}

function priority() {
    let n = document.getElementById("numProcesses").value;
    let processes = [];

    for (let i = 0; i < n; i++) {
        processes.push({
            id: "P" + (i + 1),
            pn: document.getElementById("pn" + i).value,
            at: parseInt(document.getElementById("at" + i).value),
            bt: parseInt(document.getElementById("bt" + i).value),
            pr: parseInt(document.getElementById("pr" + i).value),
            remaining: parseInt(document.getElementById("bt" + i).value),
            completionTime: 0,
            responseTime: -1,
            done: false
        });
    }

    let time = 0;
    let completed = 0;
    let schedule = [];
    let wt = [];
    let tat = [];
    let rt = [];

    while (completed < n) {
        let ready = processes.filter(p => p.at <= time && !p.done);
        if (ready.length === 0) {
            let nextArrival = Math.min(...processes.filter(p => !p.done).map(p => p.at));
            createScheduleSegment(schedule, 'Idle', time, nextArrival);
            time = nextArrival;
            continue;
        }

        ready.sort((a, b) => a.pr - b.pr || a.at - b.at || a.id.localeCompare(b.id));
        let current = ready[0];
        if (current.responseTime === -1) {
            current.responseTime = time - current.at;
        }
        createScheduleSegment(schedule, current.pn, time, time + current.bt);
        current.completionTime = time + current.bt;
        time = current.completionTime;
        current.done = true;
        completed++;
        let index2 = processes.findIndex(p => p.id === current.id);
        wt[index2] = current.completionTime - current.at - current.bt;
        tat[index2] = current.completionTime - current.at;
        rt[index2] = current.responseTime;
    }

    displayResults(processes, wt, tat, rt, schedule);
}

function priorityRR() {
    let n = document.getElementById("numProcesses").value;
    let quantum = parseInt(document.getElementById("quantum").value);
    let processes = [];

    for (let i = 0; i < n; i++) {
        processes.push({
            id: "P" + (i + 1),
            pn: document.getElementById("pn" + i).value,
            at: parseInt(document.getElementById("at" + i).value),
            bt: parseInt(document.getElementById("bt" + i).value),
            pr: parseInt(document.getElementById("pr" + i).value),
            remaining: parseInt(document.getElementById("bt" + i).value),
            completionTime: 0,
            responseTime: -1,
            done: false
        });
    }

    processes.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));

    let time = 0;
    let queue = [];
    let schedule = [];
    let wt = [];
    let tat = [];
    let rt = [];
    let completed = 0;
    let index = 0;

    while (completed < n) {
        while (index < n && processes[index].at <= time) {
            queue.push(processes[index]);
            index++;
        }

        if (queue.length === 0) {
            let nextArrival = Math.min(...processes.filter(p => !p.done).map(p => p.at));
            createScheduleSegment(schedule, 'Idle', time, nextArrival);
            time = nextArrival;
            continue;
        }

        queue.sort((a, b) => a.pr - b.pr);
        let current = queue.shift();
        if (current.responseTime === -1) {
            current.responseTime = time - current.at;
        }

        let executeTime = Math.min(quantum, current.remaining);
        createScheduleSegment(schedule, current.pn, time, time + executeTime);
        time += executeTime;
        current.remaining -= executeTime;

        while (index < n && processes[index].at <= time) {
            queue.push(processes[index]);
            index++;
        }

        if (current.remaining > 0) {
            queue.push(current);
        } else {
            current.completionTime = time;
            current.done = true;
            completed++;
            let idx = processes.findIndex(p => p.id === current.id);
            wt[idx] = current.completionTime - current.at - current.bt;
            tat[idx] = current.completionTime - current.at;
            rt[idx] = current.responseTime;
        }
    }

    displayResults(processes, wt, tat, rt, schedule);
}