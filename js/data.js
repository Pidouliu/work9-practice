// 运动场馆 - 数据层
// 优先从 data/venues.json 加载，失败则使用下方内置数据降级
// （直接双击 HTML 用 file:// 打开时，浏览器会拦截 fetch 本地 JSON）

const FALLBACK_VENUES = [
  { id: 1, name: "中心篮球馆", type: "篮球", area: "中心区", capacity: 500, openTime: "08:00-22:00", price: 30, rating: 4.8, bookings: 320, status: "开放", icon: "🏀", desc: "标准室内篮球场，木质地板，配备电子计分牌和观众席。" },
  { id: 2, name: "东区羽毛球馆", type: "羽毛球", area: "东区", capacity: 200, openTime: "07:00-23:00", price: 25, rating: 4.6, bookings: 280, status: "开放", icon: "🏸", desc: "12片标准塑胶场地，灯光充足，设有更衣室和淋浴间。" },
  { id: 3, name: "游泳馆", type: "游泳", area: "西区", capacity: 300, openTime: "06:00-21:00", price: 40, rating: 4.7, bookings: 410, status: "开放", icon: "🏊", desc: "50米标准泳池，恒温26℃，配备专业救生员。" },
  { id: 4, name: "南区足球场", type: "足球", area: "南区", capacity: 1000, openTime: "08:00-20:00", price: 200, rating: 4.5, bookings: 150, status: "开放", icon: "⚽", desc: "标准11人制天然草坪足球场，夜间灯光照明。" },
  { id: 5, name: "网球中心", type: "网球", area: "中心区", capacity: 120, openTime: "08:00-22:00", price: 60, rating: 4.4, bookings: 180, status: "维护中", icon: "🎾", desc: "4片硬地网球场，专业围网，定期维护保养。" },
  { id: 6, name: "北区乒乓球馆", type: "乒乓球", area: "北区", capacity: 150, openTime: "08:00-22:00", price: 15, rating: 4.3, bookings: 220, status: "开放", icon: "🏓", desc: "20张标准球台，地胶防滑，环境整洁。" },
  { id: 7, name: "健身房", type: "健身", area: "东区", capacity: 80, openTime: "06:00-23:00", price: 50, rating: 4.9, bookings: 560, status: "开放", icon: "🏋️", desc: "配备力量区、有氧区、瑜伽室，提供私人教练服务。" },
  { id: 8, name: "西区篮球馆", type: "篮球", area: "西区", capacity: 400, openTime: "09:00-21:00", price: 28, rating: 4.2, bookings: 210, status: "开放", icon: "🏀", desc: "半场篮球训练馆，适合团队训练和比赛。" },
  { id: 9, name: "南区羽毛球馆", type: "羽毛球", area: "南区", capacity: 160, openTime: "08:00-22:00", price: 22, rating: 4.1, bookings: 190, status: "开放", icon: "🏸", desc: "8片标准场地，通风良好，性价比高。" },
  { id: 10, name: "北区游泳馆", type: "游泳", area: "北区", capacity: 250, openTime: "07:00-20:00", price: 35, rating: 4.6, bookings: 340, status: "开放", icon: "🏊", desc: "25米短池，适合初学者和日常锻炼。" },
  { id: 11, name: "中心足球场", type: "足球", area: "中心区", capacity: 800, openTime: "08:00-21:00", price: 180, rating: 4.7, bookings: 260, status: "开放", icon: "⚽", desc: "人工草坪7人制足球场，排水良好。" },
  { id: 12, name: "东区网球场", type: "网球", area: "东区", capacity: 100, openTime: "07:00-22:00", price: 55, rating: 4.5, bookings: 130, status: "开放", icon: "🎾", desc: "2片红土网球场，体验顶级赛事场地。" }
];

// 全局场馆数据（加载后填充）
let venuesData = [];

/**
 * 加载场馆数据
 * 优先 fetch data/venues.json，失败则使用 FALLBACK_VENUES
 * @returns {Promise<Array>}
 */
async function loadVenues() {
  if (venuesData.length > 0) return venuesData;
  try {
    const res = await fetch("data/venues.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    venuesData = await res.json();
    console.log("[数据] 从 venues.json 加载成功，共", venuesData.length, "条");
  } catch (err) {
    console.warn("[数据] fetch 失败，使用内置降级数据:", err.message);
    venuesData = JSON.parse(JSON.stringify(FALLBACK_VENUES));
  }
  return venuesData;
}

/**
 * 获取所有场馆类型（去重）
 */
function getTypes() {
  return [...new Set(venuesData.map(v => v.type))];
}

/**
 * 获取所有区域（去重）
 */
function getAreas() {
  return [...new Set(venuesData.map(v => v.area))];
}