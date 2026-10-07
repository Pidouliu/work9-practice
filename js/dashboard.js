// 数据看板逻辑：Chart.js 图表
console.log("运动场馆信息中心 - 数据看板已加载");

let dashData = [];

const PALETTE = ["#1e88e5","#43a047","#fb8c00","#e53935","#8e24aa","#00897b","#6d4c41","#546e7a"];

function renderTypeChart() {
  const counts = {};
  dashData.forEach(v => counts[v.type] = (counts[v.type] || 0) + 1);
  const labels = Object.keys(counts);
  const data = labels.map(l => counts[l]);
  new Chart(document.getElementById("typeChart"), {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{ data: data, backgroundColor: PALETTE, borderWidth: 2, borderColor: "#fff" }]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "right", labels: { color: "#37474f" } } }
    }
  });
}

function renderAreaChart() {
  const counts = {};
  dashData.forEach(v => counts[v.area] = (counts[v.area] || 0) + 1);
  const labels = Object.keys(counts);
  const data = labels.map(l => counts[l]);
  new Chart(document.getElementById("areaChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{ label: "场馆数量", data: data, backgroundColor: "#1e88e5", borderRadius: 6 }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, ticks: { color: "#546e7a", stepSize: 1 }, grid: { color: "#eceff1" } },
        x: { ticks: { color: "#546e7a" }, grid: { display: false } }
      }
    }
  });
}

function renderPriceChart() {
  const sorted = [...dashData].sort((a, b) => b.price - a.price);
  const labels = sorted.map(v => v.name);
  const data = sorted.map(v => v.price);
  new Chart(document.getElementById("priceChart"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{ label: "价格(元/小时)", data: data, backgroundColor: "#fb8c00", borderRadius: 6 }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { color: "#546e7a" }, grid: { color: "#eceff1" } },
        y: { ticks: { color: "#546e7a" }, grid: { display: false } }
      }
    }
  });
}

function renderRatingChart() {
  const sums = {}, cnts = {};
  dashData.forEach(v => {
    sums[v.type] = (sums[v.type] || 0) + v.rating;
    cnts[v.type] = (cnts[v.type] || 0) + 1;
  });
  const labels = Object.keys(sums);
  const data = labels.map(l => (sums[l] / cnts[l]).toFixed(2));
  new Chart(document.getElementById("ratingChart"), {
    type: "radar",
    data: {
      labels: labels,
      datasets: [{
        label: "平均评分",
        data: data,
        backgroundColor: "rgba(30,136,229,0.2)",
        borderColor: "#1e88e5",
        pointBackgroundColor: "#1e88e5",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#37474f" } } },
      scales: {
        r: {
          beginAtZero: true, max: 5,
          ticks: { color: "#546e7a", backdropColor: "transparent" },
          grid: { color: "#cfd8dc" },
          angleLines: { color: "#cfd8dc" },
          pointLabels: { color: "#37474f", font: { size: 13 } }
        }
      }
    }
  });
}

loadVenues().then(list => {
  dashData = list;
  renderTypeChart();
  renderAreaChart();
  renderPriceChart();
  renderRatingChart();
}).catch(err => {
  console.error("数据看板加载失败:", err);
  document.querySelector(".chart-grid").innerHTML = `<p class="empty-tip">数据加载失败，请刷新重试</p>`;
});