// rr.js - Round Robin scheduling algorithm

function rr() {
    let processes = getProcessInputs();
    let quantum = getTimeQuantum();
    let time = 0;
    let queue = [];
    let schedule = [];
    let wt = [];
    let tat = [];
    let rt = [];
    let completed = 0;
    let index = 0;

    while (completed < processes.length) {
        while (index < processes.length && processes[index].at <= time) {
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

        while (index < processes.length && processes[index].at <= time) {
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
