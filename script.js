
let arr = [];
let original = [];
let frames = [];
let frameIndex = 0;
let timer = null;
let running = false;
let steps = 0;

const $ = id => document.getElementById(id);

const graph = {
  A: ["B", "C"],
  B: ["A", "D", "E"],
  C: ["A", "F"],
  D: ["B"],
  E: ["B", "F"],
  F: ["C", "E"]
};

const details = {
  bubble: ["Bubble Sort", "O(n²)", "O(1)"],
  selection: ["Selection Sort", "O(n²)", "O(1)"],
  linear: ["Linear Search", "O(n)", "O(1)"],
  binary: ["Binary Search", "O(log n)", "O(1)"],
  bfs: ["Breadth First Search", "O(V + E)", "O(V)"],
  dfs: ["Depth First Search", "O(V + E)", "O(V)"]
};

function algo() {
  return $("algorithm").value;
}

function generate() {
  pause();
  arr = Array.from({ length: 20 },
    () => Math.floor(Math.random() * 90) + 10);
  original = [...arr];
  $("target").value = arr[Math.floor(Math.random() * arr.length)];
  reset();
}

function render(values, highlight = [], sorted = [], found = []) {
  $("visual").innerHTML = "";

  values.forEach((value, i) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = value + "%";

    if (highlight.includes(i)) bar.classList.add("active");
    if (sorted.includes(i)) bar.classList.add("sorted");
    if (found.includes(i)) bar.classList.add("found");

    const label = document.createElement("span");
    label.textContent = value;
    bar.appendChild(label);
    $("visual").appendChild(bar);
  });
}

function renderGraph(current = [], visited = []) {
  $("graph").innerHTML = "";

  Object.keys(graph).forEach(node => {
    const el = document.createElement("div");
    el.className = "node";
    el.textContent = node;

    if (visited.includes(node)) el.classList.add("visited");
    if (current.includes(node)) el.classList.add("current");

    $("graph").appendChild(el);
  });
}

function addFrame(values, highlight = [], sorted = [],
                  found = [], message = "") {
  frames.push({
    values: [...values],
    highlight,
    sorted,
    found,
    message
  });
}

function addGraphFrame(current, visited, message) {
  frames.push({
    graph: true,
    current: current ? [current] : [],
    visited: [...visited],
    message
  });
}

// BUBBLE SORT
function bubbleSort() {
  let a = [...original];
  const n = a.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      addFrame(a, [j, j + 1], [],
        [], `Comparing ${a[j]} and ${a[j + 1]}`);

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        addFrame(a, [j, j + 1], [],
          [], `Swapping elements`);
      }
    }

    addFrame(a, [],
      Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      [], `Pass ${i + 1} completed`);
  }

  addFrame(a, [], Array.from({ length: n }, (_, i) => i),
    [], "Array sorted successfully!");
}

// SELECTION SORT
function selectionSort() {
  let a = [...original];
  const n = a.length;

  for (let i = 0; i < n; i++) {
    let min = i;

    for (let j = i + 1; j < n; j++) {
      addFrame(a, [min, j],
        Array.from({ length: i }, (_, k) => k),
        [], `Comparing ${a[min]} and ${a[j]}`);

      if (a[j] < a[min]) min = j;
    }

    [a[i], a[min]] = [a[min], a[i]];

    addFrame(a, [i, min],
      Array.from({ length: i + 1 }, (_, k) => k),
      [], `Minimum element placed at position ${i + 1}`);
  }

  addFrame(a, [], Array.from({ length: n }, (_, i) => i),
    [], "Array sorted successfully!");
}

// LINEAR SEARCH
function linearSearch() {
  const target = Number($("target").value);

  for (let i = 0; i < original.length; i++) {
    addFrame(original, [i], [],
      [], `Checking index ${i}: ${original[i]}`);

    if (original[i] === target) {
      addFrame(original, [], [], [i],
        `Value ${target} found at index ${i}`);
      return;
    }
  }

  addFrame(original, [], [], [],
    `Value ${target} not found`);
}

// BINARY SEARCH
function binarySearch() {
  const a = [...original].sort((x, y) => x - y);
  const target = Number($("target").value);
  let low = 0;
  let high = a.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    addFrame(a, [mid], [],
      [], `Checking middle value ${a[mid]}`);

    if (a[mid] === target) {
      addFrame(a, [], [], [mid],
        `Value ${target} found at index ${mid}`);
      return;
    }

    if (a[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  addFrame(a, [], [], [],
    `Value ${target} not found`);
}

// BFS
function bfs() {
  let visited = [];
  let queue = ["A"];

  while (queue.length > 0) {
    let node = queue.shift();

    if (visited.includes(node)) continue;

    visited.push(node);
    addGraphFrame(node, visited, `BFS visiting ${node}`);

    graph[node].forEach(next => {
      if (!visited.includes(next) && !queue.includes(next)) {
        queue.push(next);
      }
    });
  }

  addGraphFrame("", visited, "BFS traversal completed!");
}

// DFS
function dfs() {
  let visited = [];

  function visit(node) {
    if (visited.includes(node)) return;

    visited.push(node);
    addGraphFrame(node, visited, `DFS visiting ${node}`);

    graph[node].forEach(next => {
      if (!visited.includes(next)) {
        visit(next);
      }
    });
  }

  visit("A");
  addGraphFrame("", visited, "DFS traversal completed!");
}

// CREATE ALGORITHM FRAMES
function makeFrames() {
  frames = [];
  frameIndex = 0;
  steps = 0;

  switch (algo()) {
    case "bubble":
      bubbleSort();
      break;
    case "selection":
      selectionSort();
      break;
    case "linear":
      linearSearch();
      break;
    case "binary":
      binarySearch();
      break;
    case "bfs":
      bfs();
      break;
    case "dfs":
      dfs();
      break;
  }
}

// DISPLAY CURRENT FRAME
function showFrame(f) {
  if (f.graph) {
    $("visual").style.display = "none";
    $("graph").style.display = "flex";
    renderGraph(f.current, f.visited);
  } else {
    $("graph").style.display = "none";
    $("visual").style.display = "flex";
    render(f.values, f.highlight, f.sorted, f.found);
  }

  $("message").textContent = f.message;
  steps++;
  $("steps").textContent = steps;
}

// ANIMATION
function tick() {
  if (!running) return;

  if (frameIndex >= frames.length) {
    pause();
    $("message").textContent += " ✔";
    return;
  }

  showFrame(frames[frameIndex]);
  frameIndex++;

  const delay = 1100 - Number($("speed").value);
  timer = setTimeout(tick, delay);
}

function start() {
  if (running) return;

  if (frameIndex >= frames.length || frames.length === 0) {
    makeFrames();
  }

  if (frames.length === 0) return;

  running = true;
  tick();
}

function pause() {
  running = false;
  clearTimeout(timer);
}

function reset() {
  pause();
  frames = [];
  frameIndex = 0;
  steps = 0;

  $("steps").textContent = "0";
  $("message").textContent = "Select Start to visualize the algorithm.";

  if (algo() === "bfs" || algo() === "dfs") {
    $("visual").style.display = "none";
    $("graph").style.display = "flex";
    renderGraph();
  } else {
    $("visual").style.display = "flex";
    $("graph").style.display = "none";

    let values = [...original];
    if (algo() === "binary") {
      values.sort((a, b) => a - b);
    }
    render(values);
  }
}

// ALGORITHM CHANGE
$("algorithm").addEventListener("change", () => {
  const selected = algo();
  $("visualTitle").textContent = details[selected][0] + " Visualization";
  $("time").textContent = details[selected][1];
  $("space").textContent = details[selected][2];
  reset();
});

// BUTTON EVENTS
$("generate").addEventListener("click", generate);
$("start").addEventListener("click", start);
$("pause").addEventListener("click", pause);
$("reset").addEventListener("click", reset);
$("target").addEventListener("change", reset);

// INITIALIZE
generate();
$("time").textContent = details[algo()][1];
$("space").textContent = details[algo()][2];