// 首页逻辑：统计卡片 + 推荐场馆
console.log("运动场馆信息中心 - 首页已加载");

function renderStats(list) {
  const grid = document.getElementById("statsGrid");
  const total = list.length;
  const openCount = list.filter(v => v.status === "开放").length;
  const typeCount = new Set(list.map(v => v.type)).size;
  const totalCap = list.reduce((sum, v) => sum + v.capacity, 0);
  const stats = [
    { icon: "🏟️", num: total, label: "场馆总数" },
    { icon: "✅", num: openCount, label: "开放中" },
    { icon: "🎯", num: typeCount, label: "运动类型" },
    { icon: "👥", num: totalCap.toLocaleString(), label: "总容纳人数" }
  ];
  grid.innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-icon">${s.icon}</div>
      <div class="stat-info">
        <div class="num">${s.num}</div>
        <div class="label">${s.label}</div>
      </div>
    </div>
  `).join("");
}
function renderRecommend(list) {
  const grid = document.getElementById("recommendGrid");
  const top = [...list].sort((a, b) => b.rating - a.rating).slice(0, 4);
  grid.innerHTML = top.map(v => `
    <div class="venue-card">
      <div class="card-head">
        <span class="card-icon">${v.icon}</span>
        <div>
          <div class="card-name">${v.name}</div>
          <span class="card-type">${v.type}</span>
        </div>
      </div>
      <div class="card-desc">${v.desc}</div>
      <div class="card-meta">
        <span class="meta-item">📍 ${v.area}</span>
        <span class="meta-item">💰 ¥${v.price}/h</span>
        <span class="meta-item">⭐ ${v.rating}</span>
        <span class="meta-item ${v.status === '开放' ? 'status-open' : 'status-closed'}">● ${v.status}</span>
      </div>
    </div>
  `).join("");
}

loadVenues().then(list => {
  renderStats(list);
  renderRecommend(list);
}).catch(err => {
  console.error("首页数据加载失败:", err);
  document.getElementById("statsGrid").innerHTML = "<p class=empty-tip>数据加载失败，请刷新重试</p>";
});