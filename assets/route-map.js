(() => {
  const root = new URL('.', document.currentScript.src);
  const stops = {
    melbourne: ['1', '墨尔本', -37.8136, 144.9631, 'stay', 2],
    cairns: ['2', '凯恩斯', -16.9186, 145.7781, 'stay', 5],
    sydney: ['3', '悉尼', -33.8688, 151.2093, 'stay', 7],
    queenstown: ['4', '皇后镇', -45.0312, 168.6626, 'stay', 8],
    milford: ['A', '米佛峡湾', -44.671, 167.926, 'visit', 9],
    arrowtown: ['B', '箭镇', -44.9425, 168.8328, 'visit', 11],
    wanaka: ['C', '瓦纳卡', -44.7, 169.15, 'visit', 11],
    cook: ['5', '库克山', -43.735, 170.096, 'stay', 11],
    pukaki: ['D', '普卡基湖', -44.17, 170.18, 'visit', 12],
    tekapo: ['E', '蒂卡波', -44.004, 170.477, 'visit', 12],
    christchurch: ['6', '基督城机场', -43.4894, 172.5322, 'transit', 12],
    auckland: ['7/9', '奥克兰', -36.8485, 174.7633, 'stay', 13],
    waitomo: ['F', '怀托摩', -38.26, 175.10, 'visit', 13],
    waiotapu: ['G', '怀奥塔普', -38.36, 176.37, 'visit', 13],
    rotorua: ['8', '罗托鲁瓦', -38.1368, 176.2497, 'stay', 13],
    matamata: ['H', '玛塔玛塔', -37.81, 175.77, 'visit', 14]
  };
  const regions = {
    au: {
      stops: ['melbourne', 'cairns', 'sydney'],
      lines: [['flight', 'melbourne', 'cairns', 'sydney']],
      note: '墨尔本 → 凯恩斯 → 悉尼；城市间乘飞机。'
    },
    nz: {
      stops: ['queenstown', 'milford', 'arrowtown', 'wanaka', 'cook', 'pukaki', 'tekapo', 'christchurch', 'auckland', 'waitomo', 'waiotapu', 'rotorua', 'matamata'],
      lines: [
        ['daytrip', 'queenstown', 'milford'],
        ['road', 'queenstown', 'arrowtown', 'wanaka', 'cook', 'pukaki', 'tekapo', 'christchurch'],
        ['flight', 'christchurch', 'auckland'],
        ['road', 'auckland', 'waitomo', 'waiotapu', 'rotorua', 'matamata', 'auckland']
      ],
      note: '悉尼飞皇后镇。南岛经库克山至基督城机场，再飞奥克兰；北岛环线回到奥克兰。基督城仅机场中转。'
    }
  };
  const lineStyles = {
    flight: { color: '#b34b38', weight: 3, dashArray: '9 8' },
    road: { color: '#47724e', weight: 3 },
    daytrip: { color: '#2f7f8d', weight: 3, dashArray: '3 7' }
  };
  const canvas = document.getElementById('interactiveMap');
  const status = document.getElementById('routeMapStatus');
  const retry = document.getElementById('retryRouteMap');
  let map, tiles, overlays, libraryPromise, region = 'au', markers = {};
  let tileErrors = 0, tileTimer;
  const latLng = id => stops[id].slice(2, 4);
  const isVisible = () => !document.getElementById('route-map').hidden;

  function setStatus(message, canRetry = false) {
    status.textContent = message;
    retry.hidden = !canRetry;
    status.parentElement.hidden = !message;
  }

  function loadAsset(tag, file) {
    return new Promise((resolve, reject) => {
      const element = document.createElement(tag);
      const timer = setTimeout(() => finish(new Error('地图组件加载超时')), 15000);
      function finish(error) {
        clearTimeout(timer);
        element.onload = element.onerror = null;
        if (error) { element.remove(); reject(error); } else resolve();
      }
      element.onload = () => finish();
      element.onerror = () => finish(new Error('地图组件加载失败'));
      if (tag === 'link') { element.rel = 'stylesheet'; element.href = new URL(file, root); }
      else element.src = new URL(file, root);
      document.head.appendChild(element);
    });
  }

  function loadLibrary() {
    if (!libraryPromise) {
      libraryPromise = Promise.all([
        loadAsset('link', 'vendor/leaflet-1.9.4/leaflet.css'),
        loadAsset('script', 'vendor/leaflet-1.9.4/leaflet.js')
      ]).catch(error => { libraryPromise = null; throw error; });
    }
    return libraryPromise;
  }

  function fitRoute() {
    if (map) map.fitBounds(regions[region].stops.map(latLng), { padding: [35, 45], animate: false });
  }

  function selectStop(id) {
    if (!map || !markers[id]) return;
    map.setView(latLng(id), 10, { animate: false });
    markers[id].openPopup();
    canvas.scrollIntoView({ block: 'center', behavior: 'auto' });
  }

  function renderRegion() {
    const data = regions[region];
    document.querySelectorAll('[data-map-region]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.mapRegion === region));
    });
    document.getElementById('routeMapNote').textContent = data.note;
    document.getElementById('routeMapStops').innerHTML = data.stops.map(id => {
      const [label, name] = stops[id];
      return `<button type="button" class="route-stop" data-map-stop="${id}"><b>${label}</b>${name}</button>`;
    }).join('');
    if (!map) return;
    overlays.clearLayers();
    markers = {};
    data.lines.forEach(([type, ...ids]) => {
      L.polyline(ids.map(latLng), { ...lineStyles[type], interactive: false }).addTo(overlays);
    });
    data.stops.forEach(id => {
      const [label, name, lat, lng, kind, day] = stops[id];
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({ className: `route-marker ${kind}`, html: `<span>${label}</span>`, iconSize: [40, 40], iconAnchor: [20, 20] }),
        title: name, alt: name, riseOnHover: true
      }).on('add', function () { this.getElement().setAttribute('aria-label', name); }).addTo(overlays);
      marker.bindTooltip(name, { direction: 'top', offset: [0, -15] });
      marker.bindPopup(`<strong>${name}</strong><a href="#itinerary/day-${day}">查看 D${day} 行程 →</a>`, { maxWidth: 220 });
      markers[id] = marker;
    });
    fitRoute();
  }

  function initializeMap() {
    map = L.map(canvas, { scrollWheelZoom: false, attributionControl: true, zoomControl: false, minZoom: 3, maxZoom: 18 });
    L.control.zoom({ position: 'topright', zoomInTitle: '放大地图', zoomOutTitle: '缩小地图' }).addTo(map);
    tiles = L.tileLayer(canvas.dataset.tileUrl, {
      maxZoom: 19, keepBuffer: 1,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    });
    tiles.on('loading', () => {
      tileErrors = 0;
      clearTimeout(tileTimer);
      setStatus('地图加载中…');
      tileTimer = setTimeout(() => setStatus('底图加载较慢，可稍后重试。', true), 15000);
    });
    tiles.on('tileerror', () => { tileErrors++; });
    tiles.on('load', () => {
      clearTimeout(tileTimer);
      setStatus(tileErrors ? '部分底图未能加载，行程标记仍可查看。' : '', tileErrors > 0);
    });
    overlays = L.layerGroup().addTo(map);
    renderRegion();
    tiles.addTo(map);
  }

  async function show() {
    if (!isVisible()) return;
    renderRegionControls();
    if (map) { map.invalidateSize({ pan: false }); return; }
    setStatus('地图加载中…');
    try {
      await loadLibrary();
      if (!isVisible()) return;
      if (!map) initializeMap();
    } catch {
      setStatus('地图未能加载，请检查网络后重试。', true);
    }
  }

  function renderRegionControls() {
    if (!document.getElementById('routeMapStops').children.length) renderRegion();
  }

  document.querySelectorAll('[data-map-region]').forEach(button => {
    button.onclick = () => {
      region = button.dataset.mapRegion;
      renderRegion();
      if (!map) show();
    };
  });
  document.getElementById('routeMapStops').onclick = event => {
    const button = event.target.closest('[data-map-stop]');
    if (button) selectStop(button.dataset.mapStop);
  };
  document.getElementById('fitRouteMap').onclick = fitRoute;
  retry.onclick = () => {
    if (tiles) tiles.redraw(); else show();
  };
  window.routeMap = { show };
})();
