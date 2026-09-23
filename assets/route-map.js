(() => {
  const root = new URL('.', document.currentScript.src);
  const stops = {
    shanghai: ['沪', '上海', 31.2304, 121.4737, 'transit', 1],
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
  const stopEnglishNames = {
    shanghai: 'Shanghai', melbourne: 'Melbourne', cairns: 'Cairns', sydney: 'Sydney',
    queenstown: 'Queenstown', milford: 'Milford Sound', arrowtown: 'Arrowtown', wanaka: 'Wanaka',
    cook: 'Aoraki / Mount Cook', pukaki: 'Lake Pukaki', tekapo: 'Lake Tekapo',
    christchurch: 'Christchurch Airport', auckland: 'Auckland', waitomo: 'Waitomo Caves',
    waiotapu: 'Wai-O-Tapu', rotorua: 'Rotorua', matamata: 'Matamata'
  };
  regions.all = {
    stops: ['shanghai', ...regions.au.stops, ...regions.nz.stops],
    lines: [
      ['flight', 'shanghai', 'melbourne'],
      ...regions.au.lines,
      ['flight', 'sydney', 'queenstown'],
      ...regions.nz.lines,
      ['flight', 'auckland', 'shanghai']
    ],
    note: '上海出发，经澳大利亚、新西兰南北岛，再返回上海。'
  };
  const lineStyles = {
    flight: { color: '#b34b38', weight: 3, dashArray: '9 8' },
    road: { color: '#47724e', weight: 3 },
    daytrip: { color: '#2f7f8d', weight: 3, dashArray: '3 7' }
  };
  const canvas = document.getElementById('interactiveMap');
  const status = document.getElementById('routeMapStatus');
  const retry = document.getElementById('retryRouteMap');
  const todayButton = document.getElementById('todayRouteMap');
  const locateButton = document.getElementById('locateRouteMap');
  const locationStatus = document.getElementById('routeLocationStatus');
  let map, tiles, overlays, libraryPromise, region = 'all', regionDate = '', markers = {};
  let viewMode = 'region', todayMarker, positionMarker, accuracyCircle, viewRevision = 0;
  let tileErrors = 0, tileTimer, mapReady = false;
  const latLng = id => stops[id].slice(2, 4);
  const isVisible = () => !document.getElementById('route-map').hidden;

  function mapDateKey(now = new Date()) {
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function defaultRegion(now = new Date()) {
    const date = mapDateKey(now);
    const day = itinerary.findIndex(item => '2026-' + item.date.replace('/', '-') === date);
    if (day >= 1 && day <= 6) return 'au';
    if (day >= 7 && day <= 13) return 'nz';
    return 'all';
  }

  function todayLocation(now = new Date()) {
    const day = itinerary.findIndex(item => '2026-' + item.date.replace('/', '-') === mapDateKey(now));
    const locations = [null, 'melbourne', 'Twelve Apostles', 'melbourne', 'cairns', 'Kuranda', 'sydney', 'queenstown', 'milford', 'queenstown', 'cook', 'tekapo', 'rotorua', 'auckland'];
    const id = locations[day];
    if (!id) return null;
    return stops[id] ? { name: stops[id][1], coordinates: latLng(id) } : { name: placeNames[id], coordinates: placeLocations[id].coordinates };
  }

  function updateViewControls() {
    const location = todayLocation();
    todayButton.disabled = !location;
    todayButton.textContent = location ? `今日 · ${location.name}` : '今日地点';
    todayButton.setAttribute('aria-pressed', String(viewMode === 'today'));
    locateButton.setAttribute('aria-pressed', String(viewMode === 'location'));
    document.querySelectorAll('[data-map-region]').forEach(button => {
      button.setAttribute('aria-pressed', String(viewMode === 'region' && button.dataset.mapRegion === region));
    });
  }

  function focusToday() {
    const location = todayLocation();
    if (!map || !location) return;
    if (mapReady) map.stop();
    map.closePopup();
    map.invalidateSize({ pan: false });
    if (todayMarker) map.removeLayer(todayMarker);
    todayMarker = L.circleMarker(location.coordinates, { radius: 8, color: '#853e30', weight: 2, fillColor: '#faf6ec', fillOpacity: 1 })
      .bindTooltip(`今日行程 · ${location.name}`, { permanent: true, direction: 'top', offset: [0, -10] }).addTo(map);
    map.setView(location.coordinates, 11, { animate: false });
  }

  function locationMessage(message) {
    locationStatus.textContent = message;
    locationStatus.hidden = !message;
  }

  async function locate() {
    if (!window.isSecureContext) { locationMessage('定位需使用 HTTPS，请从线上手册打开。'); return; }
    if (!navigator.geolocation) { locationMessage('此浏览器不支持定位，可查看今日行程地点。'); return; }
    locateButton.disabled = true;
    const revision = ++viewRevision;
    locationMessage('正在获取位置…');
    await show();
    if (!map || !isVisible()) { locateButton.disabled = false; locationMessage('地图未就绪，请稍后重试。'); return; }
    const fail = error => {
      locateButton.disabled = false;
      locationMessage(({ 1: '未获定位权限，可在浏览器设置中允许后重试。', 2: '暂时无法定位，请检查手机定位服务后重试。', 3: '定位超时，请在信号较好处重试。' })[error.code] || '定位失败，请稍后重试。');
    };
    try {
      navigator.geolocation.getCurrentPosition(position => {
        locateButton.disabled = false;
        const { latitude, longitude, accuracy } = position.coords;
        if (![latitude, longitude, accuracy].every(Number.isFinite)) { fail({}); return; }
        const coordinates = [latitude, longitude];
        if (positionMarker) map.removeLayer(positionMarker);
        if (accuracyCircle) map.removeLayer(accuracyCircle);
        accuracyCircle = L.circle(coordinates, { radius: accuracy, color: '#135d79', weight: 1, fillOpacity: 0.08 }).addTo(map);
        positionMarker = L.circleMarker(coordinates, { radius: 8, color: '#fff', weight: 3, fillColor: '#135d79', fillOpacity: 1 })
          .bindTooltip('我的位置', { permanent: true, direction: 'top', offset: [0, -10] }).addTo(map);
        locationMessage(`定位精度约 ${Math.round(accuracy)} 米 · 再次点击可更新`);
        if (revision === viewRevision && isVisible()) {
          viewMode = 'location';
          map.stop();
          map.closePopup();
          map.fitBounds(accuracyCircle.getBounds(), { padding: [35, 45], maxZoom: 16, animate: false });
          updateViewControls();
        }
      }, fail, { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
    } catch { fail({}); }
  }

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
    if (!map) return;
    if (mapReady) map.stop();
    map.closePopup();
    map.invalidateSize({ pan: false });
    map.fitBounds(regions[region].stops.map(latLng), { padding: [35, 45], animate: false });
  }

  function selectStop(id) {
    if (!map || !markers[id]) return;
    viewRevision++;
    viewMode = 'stop';
    updateViewControls();
    map.setView(latLng(id), 10, { animate: false });
    markers[id].openPopup();
    canvas.scrollIntoView({ block: 'center', behavior: 'auto' });
  }

  function renderRegion() {
    const data = regions[region];
    updateViewControls();
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
      const popup = document.createElement('div');
      const heading = document.createElement('strong');
      heading.textContent = name;
      const english = document.createElement('small');
      english.className = 'map-popup-english';
      english.lang = 'en';
      english.textContent = stopEnglishNames[id];
      const itineraryLink = document.createElement('a');
      itineraryLink.href = `#itinerary/day-${day}`;
      itineraryLink.textContent = `查看 D${day} 行程 →`;
      const copyButtons = document.createElement('div');
      copyButtons.className = 'map-popup-copy';
      [['复制中文', name], ['复制英文', stopEnglishNames[id]]].forEach(([label, value]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'outline-btn';
        button.textContent = label;
        button.onclick = () => window.copyText(value);
        copyButtons.appendChild(button);
      });
      popup.append(heading, english, itineraryLink, copyButtons);
      marker.bindPopup(popup, { maxWidth: 220 });
      markers[id] = marker;
    });
    if (viewMode === 'today') focusToday(); else fitRoute();
  }

  function initializeMap() {
    map = L.map(canvas, { scrollWheelZoom: false, attributionControl: true, zoomControl: false, minZoom: 2, maxZoom: 18 });
    L.control.zoom({ position: 'topright', zoomInTitle: '放大地图', zoomOutTitle: '缩小地图' }).addTo(map);
    tiles = L.tileLayer(canvas.dataset.tileUrl, {
      maxZoom: 19, keepBuffer: 1,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
    });
    tiles.on('loading', () => {
      tileErrors = 0;
      clearTimeout(tileTimer);
      setStatus('地图加载中…');
      tileTimer = setTimeout(() => setStatus('地图加载较慢，请稍后重试。', true), 15000);
    });
    tiles.on('tileerror', () => { tileErrors++; });
    tiles.on('load', () => {
      clearTimeout(tileTimer);
      setStatus(tileErrors ? '地图未完全加载，可重试。' : '', tileErrors > 0);
    });
    overlays = L.layerGroup().addTo(map);
    renderRegion();
    mapReady = true;
    tiles.addTo(map);
  }

  async function show() {
    if (!isVisible()) return;
    const now = new Date();
    const date = mapDateKey(now);
    if (regionDate !== date) {
      regionDate = date;
      region = defaultRegion(now);
      viewMode = todayLocation(now) ? 'today' : 'region';
      viewRevision++;
      if (todayMarker && map) { map.removeLayer(todayMarker); todayMarker = null; }
      renderRegion();
    }
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
      regionDate = mapDateKey();
      viewMode = 'region';
      viewRevision++;
      renderRegion();
      if (!map) show();
      if (region === 'all' && map && typeof window.notifyTouch === 'function') window.notifyTouch('已显示完整行程');
    };
  });
  todayButton.onclick = () => {
    if (!todayLocation()) return;
    region = defaultRegion();
    regionDate = mapDateKey();
    viewMode = 'today';
    viewRevision++;
    renderRegion();
    if (!map) show();
  };
  locateButton.onclick = locate;
  document.getElementById('routeMapStops').onclick = event => {
    const button = event.target.closest('[data-map-stop]');
    if (button) selectStop(button.dataset.mapStop);
  };
  retry.onclick = () => {
    if (tiles) tiles.redraw(); else show();
  };

  let placeMap, placeTimer, placeGeneration = 0;

  function clearPlace() {
    placeGeneration++;
    clearTimeout(placeTimer);
    if (placeMap) { placeMap.remove(); placeMap = null; }
  }

  async function showPlace(element, location, name, message, retryButton) {
    clearPlace();
    const generation = placeGeneration;
    const current = () => generation === placeGeneration && element.isConnected;
    const report = (text, canRetry = false) => {
      if (!current()) return;
      message.textContent = text;
      message.parentElement.hidden = !text;
      retryButton.hidden = !canRetry;
    };
    retryButton.onclick = () => showPlace(element, location, name, message, retryButton);
    report('地图加载中…');
    try {
      await loadLibrary();
      if (!current()) return;
      placeMap = L.map(element, { scrollWheelZoom: false, zoomControl: false, minZoom: 2, maxZoom: 18 })
        .setView(location.coordinates, location.zoom || 16);
      if (location.bounds) placeMap.fitBounds(location.bounds, { padding: [25, 35], maxZoom: 16, animate: false });
      L.control.zoom({ position: 'topright', zoomInTitle: '放大地图', zoomOutTitle: '缩小地图' }).addTo(placeMap);
      const label = document.createElement('span');
      label.textContent = name;
      L.circleMarker(location.coordinates, { radius: 9, color: '#fff', weight: 3, fillColor: '#135d79', fillOpacity: 1 })
        .bindTooltip(label, { permanent: true, direction: 'top', offset: [0, -12] }).addTo(placeMap);
      const layer = L.tileLayer(canvas.dataset.tileUrl, {
        maxZoom: 19, keepBuffer: 1,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
      });
      let errors = 0;
      layer.on('loading', () => {
        if (!current()) return;
        errors = 0;
        clearTimeout(placeTimer);
        report('地图加载中…');
        placeTimer = setTimeout(() => report('地图加载较慢，请稍后重试。', true), 15000);
      });
      layer.on('tileerror', () => { errors++; });
      layer.on('load', () => {
        if (!current()) return;
        clearTimeout(placeTimer);
        report(errors ? '地图未完全加载，可重试。' : '', errors > 0);
      });
      layer.addTo(placeMap);
    } catch {
      report('地图未能加载，请检查网络后重试。', true);
    }
  }

  window.routeMap = { show, showPlace, clearPlace };
})();
