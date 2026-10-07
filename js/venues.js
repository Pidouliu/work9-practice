// 场馆查询页逻辑：搜索 + 筛选 + 排序 + 详情
console.log("运动场馆信息中心 - 场馆查询页已加载");

let allVenues = [];
let venueModal = null;

function init() {
  const typeSel = document.getElementById("typeFilter");
  const areaSel = document.getElementById("areaFilter");
  const searchInput = document.getElementById("searchInput");
  const sortSel = document.getElementById("sortSelect");

  getTypes().forEach(t => {
    const opt = document.createElement("option");
    opt.value = t; opt.textContent = t;
    typeSel.appendChild(opt);
  });
  getAreas().forEach(a => {
    const opt = document.createElement("option");
    opt.value = a; opt.textContent = a;
    areaSel.appendChild(opt);
  });

  searchInput.addEventListener("input", renderList);
  typeSel.addEventListener("change", renderList);
  areaSel.addEventListener("change", renderList);
  sortSel.addEventListener("change", renderList);

  venueModal = new bootstrap.Modal(document.getElementById("venueModal"));
  renderList();
}

function getFiltered() {
  const kw = document.getElementById("searchInput").value.trim().toLowerCase();
  const type = document.getElementById("typeFilter").value;
  const area = document.getElementById("areaFilter").value;
  const sort = document.getElementById("sortSelect").value;

  let list = allVenues.filter(v => {
    const okName = !kw || v.name.toLowerCase().includes(kw);
    const okType = !type || v.type === type;
    const okArea = !area || v.area === area;
    return okName && okType && okArea;
  });

  switch (sort) {
    case "priceAsc":     list.sort((a, b) => a.price - b.price); break;
    case "priceDesc":    list.sort((a, b) => b.price - a.price); break;
    case "ratingDesc":   list.sort((a, b) => b.rating - a.rating); break;
    case "capacityDesc": list.sort((a, b) => b.capacity - a.capacity); break;
  }
  return list;
}

function renderList() {
  const list = getFiltered();
  const grid = document.getElementById("venueGrid");
  document.getElementById("resultCount").textContent = `共 ${list.length} 条`;

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-tip">😕 没有找到符合条件的场馆</div>`;
    return;
  }

  grid.innerHTML = list.map(v => `
    <div class="venue-card" data-id="${v.id}" style="cursor:pointer">
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
        <span class="meta-item">👥 ${v.capacity}人</span>
        <span class="meta-item">💰 ¥${v.price}/h</span>
        <span class="meta-item">⭐ ${v.rating}</span>
        <span class="meta-item ${v.status === "开放" ? "status-open" : "status-closed"}">● ${v.status}</span>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".venue-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = parseInt(card.dataset.id);
      const v = allVenues.find(x => x.id === id);
      if (v) showDetail(v);
    });
  });
}

function showDetail(v) {
  document.getElementById("modalTitle").textContent = `${v.icon} ${v.name}`;
  document.getElementById("modalBody").innerHTML = `
    <p class="text-muted">${v.desc}</p>
    <ul class="list-group list-group-flush">
      <li class="list-group-item"><strong>类型：</strong>${v.type}</li>
      <li class="list-group-item"><strong>区域：</strong>${v.area}</li>
      <li class="list-group-item"><strong>容纳人数：</strong>${v.capacity} 人</li>
      <li class="list-group-item"><strong>开放时间：</strong>${v.openTime}</li>
      <li class="list-group-item"><strong>价格：</strong>¥${v.price}/小时</li>
      <li class="list-group-item"><strong>评分：</strong>⭐ ${v.rating}</li>
      <li class="list-group-item"><strong>累计预约：</strong>${v.bookings} 次</li>
      <li class="list-group-item"><strong>状态：</strong>${v.status}</li>
    </ul>
  `;
  venueModal.show();
}

document.addEventListener("click", e => {
  if (e.target.id === "bookBtn") {
    alert("预约功能演示：实际项目可对接后端 API");
  }
});

loadVenues().then(list => {
  allVenues = list;
  init();
}).catch(err => {
  console.error("场馆查询页数据加载失败:", err);
  document.getElementById("venueGrid").innerHTML = `<p class="empty-tip">数据加载失败，请刷新重试</p>`;
});