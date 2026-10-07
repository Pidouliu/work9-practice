// 三维展示逻辑：Three.js 场馆模型
console.log("运动场馆信息中心 - 三维展示已加载");

let scene, camera, renderer, controls;
let venueMeshes = [];

function initThree() {
  const container = document.getElementById("three-container");
  const w = container.clientWidth;
  const h = container.clientHeight;

  // 场景（带雾效，远处淡出）
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);
  scene.fog = new THREE.Fog(0x1a1a2e, 50, 200);

  // 透视相机
  camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera.position.set(40, 30, 40);
  camera.lookAt(0, 0, 0);

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // 轨道控制（鼠标拖动/缩放/平移）
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 15;
  controls.maxDistance = 120;
  controls.maxPolarAngle = Math.PI / 2.2;

  // 光照：环境光 + 方向光（带阴影）
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(30, 50, 20);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 200;
  dirLight.shadow.camera.left = -80;
  dirLight.shadow.camera.right = 80;
  dirLight.shadow.camera.top = 80;
  dirLight.shadow.camera.bottom = -80;
  scene.add(dirLight);

  // 地面（草坪）
  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // 道路（中央十字）
  const roadGeo = new THREE.PlaneGeometry(8, 200);
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x9e9e9e, roughness: 0.8 });
  const road1 = new THREE.Mesh(roadGeo, roadMat);
  road1.rotation.x = -Math.PI / 2;
  road1.position.y = 0.02;
  scene.add(road1);
  const road2 = new THREE.Mesh(roadGeo, roadMat);
  road2.rotation.x = -Math.PI / 2;
  road2.rotation.z = Math.PI / 2;
  road2.position.y = 0.02;
  scene.add(road2);

  // 中心广场
  const plazaGeo = new THREE.CircleGeometry(8, 32);
  const plazaMat = new THREE.MeshStandardMaterial({ color: 0xcfd8dc, roughness: 0.7 });
  const plaza = new THREE.Mesh(plazaGeo, plazaMat);
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.03;
  scene.add(plaza);

  // 装饰树
  addTrees();

  // 启动渲染循环
  animate();
}

function addTrees() {
  const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6d4c41 });
  const leafGeo = new THREE.ConeGeometry(1.5, 3, 8);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });

  const positions = [
    [-25, 0, -25], [25, 0, -25], [-25, 0, 25], [25, 0, 25],
    [-15, 0, -30], [15, 0, -30], [-15, 0, 30], [15, 0, 30],
    [-35, 0, 0], [35, 0, 0], [0, 0, -35], [0, 0, 35]
  ];

  positions.forEach(([x, y, z]) => {
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.set(x, y + 1, z);
    trunk.castShadow = true;
    scene.add(trunk);

    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(x, y + 3.5, z);
    leaf.castShadow = true;
    scene.add(leaf);
  });
}

function buildVenues(list) {
  // 各类型场馆的颜色
  const colors = {
    "篮球": 0xe53935, "羽毛球": 0xffeb3b, "游泳": 0x1e88e5,
    "足球": 0x43a047, "网球": 0xfb8c00, "乒乓球": 0x8e24aa,
    "健身": 0x00897b
  };
  // 8 个场馆的位置布局（围绕中心广场）
  const layout = [
    [-20, 0, -20], [0, 0, -20], [20, 0, -20],
    [-20, 0, 0],   [20, 0, 0],
    [-20, 0, 20],  [0, 0, 20], [20, 0, 20]
  ];

  // 取前 8 个场馆展示
  const venues = list.slice(0, 8);
  venueMeshes = [];

  venues.forEach((v, i) => {
    const [x, y, z] = layout[i] || [0, 0, 0];
    const group = new THREE.Group();

    // 根据类型选不同形状的主体
    let bodyGeo, bodyH = 4;
    const type = v.type;
    if (type === "游泳" || type === "健身") {
      bodyGeo = new THREE.BoxGeometry(6, bodyH, 6);
    } else if (type === "足球" || type === "篮球") {
      bodyGeo = new THREE.CylinderGeometry(3.5, 3.5, bodyH, 24);
    } else {
      bodyGeo = new THREE.BoxGeometry(5, bodyH, 7);
    }
    const bodyMat = new THREE.MeshStandardMaterial({
      color: colors[type] || 0x607d8b,
      roughness: 0.6,
      metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = bodyH / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // 屋顶：方体用平顶，圆柱用锥顶
    let roof;
    if (bodyGeo.type === "BoxGeometry") {
      const roofGeo = new THREE.BoxGeometry(6.4, 0.5, 6.4);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x37474f });
      roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = bodyH + 0.25;
    } else {
      const roofGeo = new THREE.ConeGeometry(3.8, 2, 24);
      const roofMat = new THREE.MeshStandardMaterial({ color: 0x37474f });
      roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = bodyH + 1;
    }
    roof.castShadow = true;
    group.add(roof);

    // 标签柱（旗杆 + 小旗子）
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(3.5, bodyH + 1.5, 0);
    group.add(pole);

    const flagGeo = new THREE.PlaneGeometry(1.5, 1);
    const flagMat = new THREE.MeshStandardMaterial({
      color: colors[type] || 0xff0000,
      side: THREE.DoubleSide
    });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(4.25, bodyH + 2, 0);
    group.add(flag);

    group.position.set(x, y, z);
    group.userData = { venue: v };
    scene.add(group);
    venueMeshes.push(group);
  });

  document.getElementById("venue-tip").textContent =
    "已加载 " + venues.length + " 个场馆 · 鼠标拖动旋转 · 滚轮缩放";
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

function onResize() {
  const container = document.getElementById("three-container");
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

window.addEventListener("resize", onResize);

// 启动：先初始化场景，再加载数据并构建场馆
initThree();
loadVenues().then(list => {
  buildVenues(list);
}).catch(err => {
  console.error("3D 场景数据加载失败:", err);
  document.getElementById("venue-tip").textContent = "数据加载失败";
});