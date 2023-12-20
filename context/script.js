class Queue {
    constructor() {
      this.items = [];
    }
  
    enqueue(element) {
      this.items.push(element);
    }
  
    dequeue() {
      if (this.isEmpty()) {
        return 'Underflow';
      }
      return this.items.shift();
    }
  
    front() {
      if (this.isEmpty()) {
        return 'No elements in Queue';
      }
      return this.items[0];
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  }
  
  const readyQueue = new Queue();
  let runningProcess = null;
  let intervalId = null;
  
  function updateRunningProcessUI() {
    const runningProcessDiv = document.getElementById('runningProcess');
    if (runningProcess) {
      runningProcessDiv.innerHTML = `
        <p>Process: ${runningProcess.process}</p>
        <p>Time: ${runningProcess.time} seconds</p>
        <button onclick="stopProcess()">Stop Process</button>
      `;
    } else {
      runningProcessDiv.innerHTML = `<p>No running process</p>`;
    }
  }
  
  function updateReadyQueueUI() {
    const readyQueueUl = document.getElementById('readyQueue');
    readyQueueUl.innerHTML = readyQueue.isEmpty() ?
      '<li>No processes in ready queue</li>' :
      [...readyQueue.items].map((process, index) =>
        `<li onclick="runSelectedProcess(${index})">Process: ${process.process}, Time: ${process.time} seconds</li>`
      ).join('');
  }
  
  function addProcess() {
    const processInput = document.getElementById('processInput');
    const timeInput = document.getElementById('timeInput');
  
    const process = processInput.value.trim();
    const time = parseInt(timeInput.value);
  
    if (process && !isNaN(time)) {
      readyQueue.enqueue({ process, time });
      updateReadyQueueUI();
      processInput.value = '';
      timeInput.value = '';
    } else {
      alert('Please enter valid process and time');
    }
  }
  
  function startProcess() {
    if (!runningProcess && !readyQueue.isEmpty()) {
      runningProcess = readyQueue.dequeue();
      updateRunningProcessUI();
  
      intervalId = setInterval(() => {
        if (runningProcess.time > 0) {
          runningProcess.time--;
          updateRunningProcessUI();
        } else {
          clearInterval(intervalId);
          runningProcess = null;
          updateRunningProcessUI();
          updateReadyQueueUI();
        }
      }, 1000); // Update time every second (1000ms)
    } else {
      alert('No processes in the ready queue or a process is already running.');
    }
  }
  
  function runSelectedProcess(index) {
    if (!runningProcess) {
      runningProcess = readyQueue.items[index];
      readyQueue.items.splice(index, 1);
      updateRunningProcessUI();
      updateReadyQueueUI();
  
      intervalId = setInterval(() => {
        if (runningProcess.time > 0) {
          runningProcess.time--;
          updateRunningProcessUI();
        } else {
          clearInterval(intervalId);
          runningProcess = null;
          updateRunningProcessUI();
          updateReadyQueueUI();
        }
      }, 1000); // Update time every second (1000ms)
    } else {
      alert('A process is already running.');
    }
  }
  
  function stopProcess() {
    if (runningProcess) {
      clearInterval(intervalId);
      readyQueue.enqueue(runningProcess);
      runningProcess = null;
      updateRunningProcessUI();
      updateReadyQueueUI();
    } else {
      alert('No running process to stop.');
    }
  }
  