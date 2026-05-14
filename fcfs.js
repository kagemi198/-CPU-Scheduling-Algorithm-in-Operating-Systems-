// fcfs.js - First-Come, First-Served scheduling algorithm

function fcfs() {
    let processes = getProcessInputs();
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
