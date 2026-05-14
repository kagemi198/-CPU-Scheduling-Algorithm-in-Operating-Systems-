// priority_rr.js - Priority scheduling with Round Robin (preemptive)

function priorityRR() {
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
    let current = null;
    let timeSliceUsed = 0;

    processes.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));

    while (completed < processes.length) {
        // Add newly arrived processes to the queue, ordered by priority among same arrivals.
        let arrivals = [];
        while (index < processes.length && processes[index].at <= time) {
            arrivals.push(processes[index]);
            index++;
        }
        arrivals.sort((a, b) => a.pr - b.pr || a.id.localeCompare(b.id));
        queue.push(...arrivals);

        // Preempt if a higher priority process arrived.
        if (current && queue.length > 0) {
            let minPrInQueue = Math.min(...queue.map(p => p.pr));
            if (minPrInQueue < current.pr) {
                queue.push(current);
                current = null;
                timeSliceUsed = 0;
            }
        }

        // Preempt when the current time quantum expires.
        if (current && timeSliceUsed >= quantum) {
            queue.push(current);
            current = null;
            timeSliceUsed = 0;
        }

        if (!current) {
            if (queue.length === 0) {
                let nextArrival = Math.min(...processes.filter(p => !p.done).map(p => p.at));
                createScheduleSegment(schedule, 'Idle', time, nextArrival);
                time = nextArrival;
                continue;
            }
            current = queue.shift();
            timeSliceUsed = 0;
        }

        if (current.responseTime === -1) {
            current.responseTime = time - current.at;
        }

        createScheduleSegment(schedule, current.pn, time, time + 1);
        time += 1;
        current.remaining -= 1;
        timeSliceUsed += 1;

        // Add processes that arrive during this unit.
        arrivals = [];
        while (index < processes.length && processes[index].at <= time) {
            arrivals.push(processes[index]);
            index++;
        }
        arrivals.sort((a, b) => a.pr - b.pr || a.id.localeCompare(b.id));
        queue.push(...arrivals);

        if (current.remaining === 0) {
            current.completionTime = time;
            current.done = true;
            completed++;
            let idx = processes.findIndex(p => p.id === current.id);
            wt[idx] = current.completionTime - current.at - current.bt;
            tat[idx] = current.completionTime - current.at;
            rt[idx] = current.responseTime;
            current = null;
            timeSliceUsed = 0;
        }
    }

    displayResults(processes, wt, tat, rt, schedule);
}

