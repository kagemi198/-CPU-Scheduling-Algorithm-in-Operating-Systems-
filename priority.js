// priority.js - Priority scheduling algorithm (non-preemptive)

function priority() {
    let processes = getProcessInputs();
    let time = 0;
    let completed = 0;
    let schedule = [];
    let wt = [];
    let tat = [];
    let rt = [];

    while (completed < processes.length) {
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
        let index = processes.findIndex(p => p.id === current.id);
        wt[index] = current.completionTime - current.at - current.bt;
        tat[index] = current.completionTime - current.at;
        rt[index] = current.responseTime;
    }

    displayResults(processes, wt, tat, rt, schedule);
}
