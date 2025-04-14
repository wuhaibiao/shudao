// 创建地图实例
var map = new AMap.Map('map', {
    zoom: 7,  // 调整缩放级别以显示更大范围
    center: [104.0650, 30.6570]  // 成都市中心坐标
});

// 手动设置前50行的地点经纬度
const manualLocations = {
    '巫山': [109.8783, 31.0748],
    '蜀道': [104.0650, 30.6570], // 示例坐标
    '锦水': [104.0650, 30.6570], // 示例坐标
    '三巴': [106.5505, 29.5630], // 示例坐标
    '蜀地': [104.0650, 30.6570], // 示例坐标
    '峨眉山': [103.4845, 29.6012],
    '剑阁': [105.5270, 32.2880],
    '白帝': [108.1703, 31.0545],
    '瞿塘峡': [109.4650, 31.0424],
    '黄牛峡': [106.5505, 29.5630], // 示例坐标
    '明月峡': [104.0650, 30.6570], // 示例坐标
    '重庆': [106.5505, 29.5630],
    '重庆东楼': [106.5505, 29.5630], // 示例坐标
    '成都': [104.0650, 30.6570],
    '蜀江': [104.0650, 30.6570], // 示例坐标
    '三峡': [110.4789, 31.0456],
    '江油': [104.7444, 31.7764],
    '蜀僧弹琴': [104.0650, 30.6570], // 示例坐标
    '非蜀道': [104.0650, 30.6570], // 示例坐标
    '巴水': [106.5505, 29.5630], // 示例坐标
    '巴城': [104.0650, 30.6570], // 示例坐标
    '绵阳':[104.679000,31.467801], // 示例坐标
    '宜宾': [104.63, 28.65], // 示例坐标
    '眉山':[103.849999,30.076801],
    '西安':[108.940000,34.341101],
    '广元':[105.844000,32.435300],
    '宝鸡':[107.238000,34.363099],
    '遂宁':[105.593001,30.532801],
    '德阳':[104.398000,31.126800],
    '乐山':[103.766001,29.552000],
    '成都市文翁学堂':[103.921111,30.697610],
    '成都市草玄台':[104.370422,30.589439],
    '成都市石犀':[104.058797,30.762929],
    '成都市金花寺':[104.118174,30.777530],
    '泸州':[105.441866,28.87098],
    '咸阳':[108.708999,34.329200],
    // 添加其他地点
};

// 函数：从CSV文件读取数据并创建标记
// 在manualLocations下方添加路线配置
const manualRoutes = [
       // 示例路线1
    ['乐山', '峨眉山'],    // 示例路线2
    ['剑阁', '江油'],
    ['剑阁', '广元'],
    ['江油', '绵阳'],
    ['德阳', '绵阳'],
    ['德阳', '成都市金花寺'],
    ['眉山', '峨眉山'],
    ['眉山', '成都'], 
        // 示例路线3
];

// 在loadMarkersFromCSV函数末尾添加（约第109行）
function loadMarkersFromCSV(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            // 解析CSV数据
            const rows = data.split('\n').map(row => row.split(','));

            // 创建一个对象来存储每个地点的信息
            const locations = {};

            // 跳过标题行
            for (let i = 1; i < rows.length; i++) {
                const [
                    isInShuDao = '', // 是否在蜀道
                    title = '',      // 诗
                    dynasty = '',    // 朝代
                    lifeSpan = '',   // 诗人生卒年
                    year = '',       // 写作时间
                    author = '',     // 作者
                    location = '',   // 描写地点
                    climate1 = '',   // 意象(蜀道元素)-自然-气候
                    climate2 = '',   // 意象(蜀道元素)-自然-气候
                    climate3 = '',   // 意象(蜀道元素)-自然-气候
                    landscape1 = '', // 意象(蜀道元素)-自然-山水
                    landscape2 = '', // 意象(蜀道元素)-自然-山水
                    landscape3 = '', // 意象(蜀道元素)-自然-山水
                    landscape4 = '', // 意象(蜀道元素)-自然-山水
                    biology1 = '',   // 意象(蜀道元素)-自然-生物
                    biology2 = '',   // 意象(蜀道元素)-自然-生物
                    biology3 = '',   // 意象(蜀道元素)-自然-生物
                    culture1 = '',   // 意象(蜀道元素)-人文-人文景观
                    culture2 = '',   // 意象(蜀道元素)-人文-人文风俗
                    allusion = '',    // 意象(蜀道元素)-典故
                    poemContent = '' // 诗歌内容
                ] = rows[i];

                if (location && location !== '非蜀道') {
                    const locationList = location.split('/');
                    locationList.forEach(loc => {
                        if (!locations[loc]) {
                            locations[loc] = {};
                        }
                        if (!locations[loc][author]) {
                            locations[loc][author] = {
                                lifeSpan,
                                poems: []
                            };
                        }
                        locations[loc][author].poems.push({
                            title,
                            dynasty,
                            year,
                            content: poemContent.replace(/\\n/g, '<br>'), // 处理换行符
                            details: {
                                climate: [climate1, climate2, climate3].filter(item => item.trim() !== ''),
                                landscape: [landscape1, landscape2, landscape3, landscape4].filter(item => item.trim() !== ''),
                                biology: [biology1, biology2, biology3].filter(item => item.trim() !== ''),
                                culture: [culture1, culture2].filter(item => item.trim() !== ''),
                                allusion: allusion.trim()
                            }
                        });
                    });
                }
            }

            console.log("location", locations);

            // 为每个地点创建标记
            Object.keys(locations).forEach(location => {
                if (manualLocations[location]) {
                    // 使用手动设置的经纬度
                    var lnglat = manualLocations[location];
                    createMarker(location, lnglat, locations);
                } else {
                    // 使用地理编码服务获取经纬度
                    AMap.plugin('AMap.Geocoder', function () {
                        var geocoder = new AMap.Geocoder({
                            city: "四川省"  // 指定查询的城市
                        });

                        geocoder.getLocation(location, function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                var lnglat = result.geocodes[0].location;
                                createMarker(location, lnglat, locations);
                            } else {
                                console.error('地理编码失败：', location);
                            }
                        });
                    });
                }
            });
        })
        .catch(error => console.error('Error loading CSV:', error));
}

// 创建标记的函数
// 核心步骤：
    // 1. 创建地图标记（AMap.Marker）
    // 2. 生成信息窗口内容（含诗歌链接）
    // 3. 绑定点击事件（打开信息窗口）
function createMarker(location, lnglat, locations) {
    var marker = new AMap.Marker({
        position: lnglat,
        title: location
    });

    marker.setMap(map);

    // log the location and its coordinates
    console.log(location, lnglat);

    // 创建信息窗口内容
    var content = `
        <div style="max-height: 300px; overflow-y: auto;">
            <h3 style="text-align: center;">${location}</h3>
            <ul>
            ${Object.keys(locations[location]).map((author, index) => `
                <li>
                    <strong>${index + 1}. 地点: ${location}</strong>
                    <p>作者: ${author}</p>
                    <p>生卒: ${locations[location][author].lifeSpan}</p>
                    <p>诗歌著作: ${locations[location][author].poems.map(poem => {
                    // 清理 poem.details 的每一项
                    const cleanDetails = {
                        climate: poem.details.climate.map(item => item.replace(/\\r/g, '').replace(/"/g, '').trim()).join(', ') || '无',
                        landscape: poem.details.landscape.map(item => item.replace(/\\r/g, '').replace(/"/g, '').trim()).join(', ') || '无',
                        biology: poem.details.biology.map(item => item.replace(/\\r/g, '').replace(/"/g, '').trim()).join(', ') || '无',
                        culture: poem.details.culture.map(item => item.replace(/\\r/g, '').replace(/"/g, '').trim()).join(', ') || '无',
                        allusion: poem.details.allusion.replace(/\\r/g, '').replace(/"/g, '').trim() || '无'
                    };
                    return `
                        <a href="#" onclick="logAndShowPoemDetails('${poem.title}', '${cleanDetails.climate}', '${cleanDetails.landscape}', '${cleanDetails.biology}', '${cleanDetails.culture}', '${cleanDetails.allusion}')">${poem.title}</a>
                    `;
                }).join(', ')}</p>
                </li>
            `).join('')}
            </ul>
        </div>
    `;

    // 创建信息窗口
    var infoWindow = new AMap.InfoWindow({
        content: content,
        offset: new AMap.Pixel(0, -30)
    });

    // 添加点击事件
    marker.on('click', function () {
        infoWindow.open(map, marker.getPosition());
    });
}

function logAndShowPoemDetails(title, climate, landscape, biology, culture, allusion) {
    console.log('Poem clicked:', { title, climate, landscape, biology, culture, allusion });
    showPoemDetails(title, climate, landscape, biology, culture, allusion);
    console.log('showPoemDetails called');
}

// 显示诗歌详细信息
function showPoemDetails(title, climate, landscape, biology, culture, allusion) {
    var poemContent = `
        <div style="max-height: 300px; overflow-y: auto;">
            <h3 style="text-align: center;">${title}</h3>
            <p>自然-气候: ${climate}</p>
            <p>自然-山水: ${landscape}</p>
            <p>自然-生物: ${biology}</p>
            <p>人文-人文景观: ${culture}</p>
            <p>人文-人文风俗: ${culture}</p>
            <p>典故: ${allusion}</p>
        </div>
    `;
    var poemWindow = new AMap.InfoWindow({
        content: poemContent,
        offset: new AMap.Pixel(0, -30)
    });
    poemWindow.open(map, map.getCenter());
}

// 调用函数加载CSV数据
loadMarkersFromCSV('collection.csv');

// 使用AMap插件系统加载地图控件
AMap.plugin(['AMap.Scale', 'AMap.ToolBar'], function () {
    map.addControl(new AMap.Scale());  // 添加比例尺控件
    map.addControl(new AMap.ToolBar()); // 添加工具条控件（含缩放、平移等功能）
    
    // 新增路线绘制（放在标记创建之后）
    manualRoutes.forEach(([start, end]) => {
        if (manualLocations[start] && manualLocations[end]) {
            new AMap.Polyline({
                path: [manualLocations[start], manualLocations[end]],
                strokeColor: "#ff3300",
                strokeWeight: 4,
                strokeStyle: "solid"
            }).setMap(map);
        }
    });
    
    // 添加图层控制
    map.setFeatures(['road', 'point']);
});