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
 
  function startProcess() {
    if (!runningProcess && !readyQueue.isEmpty()) {
      runningProcess = readyQueue.dequeue(); // Dequeue the process to start
      updateRunningProcessUI();
  
      intervalId = setInterval(() => {
        if (runningProcess.time > 0) {
          runningProcess.time--;
          updateRunningProcessUI();
        } else {
          clearInterval(intervalId);
          runningProcess = null;
          updateRunningProcessUI();
          updateReadyQueueUI(); // Update UI for the queue after process completion
        }
      }, 1000); // Update time every second (1000ms)
      
      updateReadyQueueUI(); // Update UI after dequeuing
    } else if (readyQueue.isEmpty()) {
      showModal("Oops! There are no processes in the ready queue.");
    } else {
      showModal("Please add a process before starting.");
    }
  }
  function showModal(message) {
    const modal = document.getElementById("myModal");
    const modalText = document.getElementById("modalText");
    modal.style.display = "block";
    modalText.textContent = message;
  
    modalTimeout = setTimeout(() => {
      closeModal();
    }, 5000);
  }
  
  function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    clearTimeout(modalTimeout);
  }
 
// ... [Previous code remains unchanged]

function addProcess() {
  const processInput = document.getElementById('processInput');
  const timeInput = document.getElementById('timeInput');

  const process = processInput.value.trim();
  const time = parseInt(timeInput.value);

  if (!process || isNaN(time) || time <= 0) {
    showModal("Please enter a valid process and time.");
  } else {
    readyQueue.enqueue({ process, time });
    updateReadyQueueUI();
    processInput.value = '';
    timeInput.value = '';
    showSuccessPopup();
  }
}

function showSuccessPopup() {
  const popup = document.getElementById('successPopup');
  popup.style.display = 'block';

  setTimeout(() => {
    popup.style.display = 'none';
  }, 2000); 
}

function clearAllProcesses() {
  if (readyQueue.isEmpty()) {
    showModal("No processes to clear in the ready queue.");
  } else {
    const queue = document.querySelector('#readyQueue');
    while (queue.firstChild) {
      queue.removeChild(queue.firstChild);
    }
    readyQueue.items = []; // Clear the items array in the Queue instance
    updateReadyQueueUI(); // Update the UI message after clearing processes
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


// Function to add a process to the ready queue with animation
function addProcessToQueue(processName) {
  const queue = document.getElementById('#readyQueue');
  const newProcess = document.createElement('li');
  newProcess.textContent = processName;
  newProcess.classList.add('add-animation');
  queue.appendChild(newProcess);

  // Trigger reflow to apply the animation
  setTimeout(() => {
    newProcess.classList.remove('add-animation');
  }, 500);
}

// Function to remove a process from the ready queue with animation
function removeProcessFromQueue(processIndex) {
  const queue = document.getElementById('#readyQueue');
  const processToRemove = queue.children[processIndex];

  if (processToRemove) {
    processToRemove.classList.add('remove-animation');
    // Wait for the animation to finish before removing the process
    processToRemove.addEventListener('animationend', () => {
      processToRemove.remove();
    });
  }
}

// Example usage
// Call addProcessToQueue to add a process with animation
addProcessToQueue('New Process');

// Call removeProcessFromQueue to remove a process at index with animation
removeProcessFromQueue(0);
