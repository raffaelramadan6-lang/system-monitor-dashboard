// System monitoring state
let cpuHistory = [];
let ramHistory = [];
let totalUpload = 0;
let totalDownload = 0;
let startTime = Date.now();

// Simulated processes
const processNames = [
    'System', 'Chrome', 'VSCode', 'Slack', 'Terminal',
    'Spotify', 'Docker', 'Node', 'Python', 'Firefox'
];

// Initialize charts
let cpuChart, ramChart;

// Start monitoring on page load
window.addEventListener('load', () => {
    initializeCharts();
    getSystemInfo();
    startMonitoring();
});

function initializeCharts() {
    const cpuCanvas = document.getElementById('cpu-chart');
    const ramCanvas = document.getElementById('ram-chart');
    
    cpuChart = cpuCanvas.getContext('2d');
    ramChart = ramCanvas.getContext('2d');
    
    // Set canvas sizes
    cpuCanvas.width = cpuCanvas.offsetWidth;
    cpuCanvas.height = 60;
    ramCanvas.width = ramCanvas.offsetWidth;
    ramCanvas.height = 60;
}

function startMonitoring() {
    // Update every second
    updateMetrics();
    setInterval(updateMetrics, 1000);
    
    // Update uptime every second
    setInterval(updateUptime, 1000);
}

function updateMetrics() {
    updateCPU();
    updateRAM();
    updateDisk();
    updateNetwork();
    updateProcesses();
}

function updateCPU() {
    // Simulate CPU usage (0-100%)
    const cpuUsage = Math.floor(Math.random() * 30) + 20 + (Math.sin(Date.now() / 10000) * 20);
    const clampedCPU = Math.max(0, Math.min(100, cpuUsage));
    
    // Update gauge
    const gauge = document.getElementById('cpu-gauge');
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (clampedCPU / 100) * circumference;
    gauge.style.strokeDashoffset = offset;
    
    // Update value
    document.getElementById('cpu-value').textContent = Math.round(clampedCPU);
    
    // Update details
    const cores = navigator.hardwareConcurrency || 4;
    document.getElementById('cpu-cores').textContent = cores;
    document.getElementById('cpu-temp').textContent = (45 + Math.random() * 15).toFixed(1) + '°C';
    document.getElementById('cpu-speed').textContent = (2.4 + Math.random() * 0.8).toFixed(2) + ' GHz';
    
    // Update timestamp
    document.getElementById('cpu-update').textContent = new Date().toLocaleTimeString();
    
    // Update history and chart
    cpuHistory.push(clampedCPU);
    if (cpuHistory.length > 30) cpuHistory.shift();
    drawChart(cpuChart, cpuHistory, '#667eea');
}

function updateRAM() {
    // Simulate RAM usage
    const ramUsage = Math.floor(Math.random() * 20) + 40 + (Math.cos(Date.now() / 15000) * 15);
    const clampedRAM = Math.max(0, Math.min(100, ramUsage));
    
    // Update gauge
    const gauge = document.getElementById('ram-gauge');
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (clampedRAM / 100) * circumference;
    gauge.style.strokeDashoffset = offset;
    
    // Update value
    document.getElementById('ram-value').textContent = Math.round(clampedRAM);
    
    // Update details (simulating 16GB RAM)
    const totalRAM = 16;
    const usedRAM = (totalRAM * clampedRAM / 100).toFixed(1);
    const availableRAM = (totalRAM - usedRAM).toFixed(1);
    
    document.getElementById('ram-used').textContent = usedRAM + ' GB';
    document.getElementById('ram-total').textContent = totalRAM + ' GB';
    document.getElementById('ram-available').textContent = availableRAM + ' GB';
    
    // Update timestamp
    document.getElementById('ram-update').textContent = new Date().toLocaleTimeString();
    
    // Update history and chart
    ramHistory.push(clampedRAM);
    if (ramHistory.length > 30) ramHistory.shift();
    drawChart(ramChart, ramHistory, '#764ba2');
}

function updateDisk() {
    // Simulate disk usage (slower changing)
    const diskUsage = 65 + Math.sin(Date.now() / 50000) * 5;
    const clampedDisk = Math.max(0, Math.min(100, diskUsage));
    
    // Update bar
    document.getElementById('disk-bar').style.width = clampedDisk + '%';
    document.getElementById('disk-percentage').textContent = Math.round(clampedDisk) + '%';
    
    // Update details (simulating 512GB disk)
    const totalDisk = 512;
    const usedDisk = (totalDisk * clampedDisk / 100).toFixed(1);
    const freeDisk = (totalDisk - usedDisk).toFixed(1);
    
    document.getElementById('disk-used').textContent = usedDisk + ' GB';
    document.getElementById('disk-free').textContent = freeDisk + ' GB';
    document.getElementById('disk-total').textContent = totalDisk + ' GB';
}

function updateNetwork() {
    // Simulate network traffic
    const uploadSpeed = Math.random() * 500 + 100;
    const downloadSpeed = Math.random() * 1500 + 500;
    
    document.getElementById('upload-speed').textContent = uploadSpeed.toFixed(0) + ' KB/s';
    document.getElementById('download-speed').textContent = downloadSpeed.toFixed(0) + ' KB/s';
    
    // Update totals
    totalUpload += uploadSpeed / 1024; // Convert to MB
    totalDownload += downloadSpeed / 1024;
    
    document.getElementById('total-upload').textContent = totalUpload.toFixed(1) + ' MB';
    document.getElementById('total-download').textContent = totalDownload.toFixed(1) + ' MB';
}

function updateProcesses() {
    const processesList = document.getElementById('processes-list');
    processesList.innerHTML = '';
    
    // Generate 5 random processes
    const processes = [];
    for (let i = 0; i < 5; i++) {
        const name = processNames[Math.floor(Math.random() * processNames.length)];
        const cpu = (Math.random() * 25).toFixed(1);
        const memory = (Math.random() * 800 + 200).toFixed(0);
        processes.push({ name, cpu, memory });
    }
    
    // Sort by CPU usage
    processes.sort((a, b) => b.cpu - a.cpu);
    
    // Display processes
    processes.forEach(proc => {
        const div = document.createElement('div');
        div.className = 'process-item';
        div.innerHTML = `
            <span>${proc.name}</span>
            <span>${proc.cpu}%</span>
            <span>${proc.memory} MB</span>
        `;
        processesList.appendChild(div);
    });
}

function getSystemInfo() {
    // Get real browser/system information
    const ua = navigator.userAgent;
    
    // Operating System
    let os = 'Unknown OS';
    if (ua.indexOf('Win') !== -1) os = 'Windows';
    else if (ua.indexOf('Mac') !== -1) os = 'macOS';
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';
    else if (ua.indexOf('Android') !== -1) os = 'Android';
    else if (ua.indexOf('iOS') !== -1) os = 'iOS';
    
    document.getElementById('os-name').textContent = os;
    
    // Browser
    let browser = 'Unknown Browser';
    if (ua.indexOf('Chrome') !== -1 && ua.indexOf('Edg') === -1) browser = 'Chrome';
    else if (ua.indexOf('Safari') !== -1 && ua.indexOf('Chrome') === -1) browser = 'Safari';
    else if (ua.indexOf('Firefox') !== -1) browser = 'Firefox';
    else if (ua.indexOf('Edg') !== -1) browser = 'Edge';
    
    document.getElementById('browser-name').textContent = browser;
    
    // Screen Resolution
    const screenRes = `${screen.width} x ${screen.height}`;
    document.getElementById('screen-res').textContent = screenRes;
    
    // User Agent (truncated)
    const truncatedUA = ua.length > 50 ? ua.substring(0, 50) + '...' : ua;
    document.getElementById('user-agent').textContent = truncatedUA;
    
    // Timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.getElementById('timezone').textContent = timezone;
}

function updateUptime() {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000) % 60;
    const minutes = Math.floor(elapsed / 60000) % 60;
    const hours = Math.floor(elapsed / 3600000);
    
    const uptimeStr = `${hours}h ${minutes}m ${seconds}s`;
    document.getElementById('uptime').textContent = uptimeStr;
}

function drawChart(ctx, data, color) {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (data.length < 2) return;
    
    // Draw line chart
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const stepX = width / (data.length - 1);
    
    data.forEach((value, index) => {
        const x = index * stepX;
        const y = height - (value / 100) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw area fill
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '00');
    ctx.fillStyle = gradient;
    ctx.fill();
}

// Add SVG gradients for gauges
const svgNS = "http://www.w3.org/2000/svg";

document.querySelectorAll('.circular-gauge').forEach((svg, index) => {
    const defs = document.createElementNS(svgNS, 'defs');
    const gradient = document.createElementNS(svgNS, 'linearGradient');
    
    gradient.setAttribute('id', index === 0 ? 'cpuGradient' : 'ramGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '0%');
    
    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('style', 'stop-color:#667eea;stop-opacity:1');
    
    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('style', 'stop-color:#764ba2;stop-opacity:1');
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
});
