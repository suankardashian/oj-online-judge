    let currentYear = 2025;
    let currentMonth = 6;
    let userData = {};
    let recordData = [];
    let carouselData = [];
    let calendarData = [];
    document.addEventListener('DOMContentLoaded', function() {
        const carousel = new mdb.Carousel(document.getElementById('ojCarousel'), {
            interval: 5000,
            hover: 'pause'
        });

        const dropdowns = document.querySelectorAll('[data-mdb-dropdown-init]');
        dropdowns.forEach(dropdown => {
            new mdb.Dropdown(dropdown);
        });

        // 初始化折叠菜单（移动端导航）
        // const collapses = document.querySelectorAll('[data-mdb-collapse-init]');
        // collapses.forEach(collapse => {
        //     new mdb.Collapse(collapse);
        // });

        loadAllData();
    });

    async function loadAllData() {
        try {
            // 并行请求所有数据（你需要替换为真实后端接口）
            const [userRes, recordRes, carouselRes, calendarRes] = await Promise.all([
                fetch('/api/user/info'), // 用户信息接口
                fetch(`/api/record/recent`), // 最近做题记录接口
                fetch('/api/carousel/list'), // 轮播图接口
                fetch(`/api/calendar/${currentYear}/${currentMonth}`) // 日历数据接口
            ]);

            // 解析数据
            userData = await userRes.json();
            recordData = await recordRes.json();
            carouselData = await carouselRes.json();
            calendarData = await calendarRes.json();

            // 渲染到页面
            renderUserInfo();
            renderRecordList();
            renderCarousel();
            renderCalendar();

        } catch (error) {
            console.error('数据加载失败:', error);
            // 加载失败时显示默认数据
            loadDefaultData();
            renderUserInfo();
            renderRecordList();
            renderCarousel();
            renderCalendar();
        }
    }

    // 3. 加载默认数据（开发阶段用，对接后端后可删除）
    function loadDefaultData() {
        // 默认用户信息
        userData = {
            avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
            name: "张三",
            noticeCount: 5
        };

        // 默认做题记录
        recordData = [
            { id: 1001, title: "两数之和", status: "ac", time: "10分钟前", costTime: "92ms", memory: "3.1MB" },
            { id: 1002, title: "两数相加", status: "wa", time: "35分钟前", passRate: "75%" },
            { id: 1003, title: "无重复字符的最长子串", status: "tle", time: "1小时前", timeLimit: "1s" },
            { id: 1004, title: "寻找两个正序数组的中位数", status: "re", time: "昨天 18:25", errorMsg: "数组越界" },
            { id: 1005, title: "最长回文子串", status: "ac", time: "昨天 15:40", costTime: "148ms", memory: "4.2MB" }
        ];

        // 默认轮播图
        carouselData = [
            { img: "https://picsum.photos/id/180/1920/1080", title: "第12届算法竞赛报名中", desc: "报名时间：2025-06-01 至 2025-06-15 | 比赛时间：2025-06-20 19:00" },
            { img: "https://picsum.photos/id/20/1920/1080", title: "6月刷题挑战活动", desc: "完成30道算法题即可获得专属勋章和学习资料" },
            { img: "https://picsum.photos/id/1/1920/1080", title: "新手刷题指南", desc: "从基础到进阶，系统掌握算法与数据结构" }
        ];

        // 默认日历数据（key: 日期, value: 做题数）
        calendarData = {
            2: 2, 3: 1, 6: 4, 8: 3, 11: 5, 14: 7, 15: 8, 18: 3, 20: 6, 22: 9, 25: 11
        };
    }

    // 4. 渲染用户信息
    function renderUserInfo() {
        document.getElementById('userAvatar').src = userData.avatar || "";
        document.getElementById('userName').textContent = userData.name || "未知用户";
        document.getElementById('noticeCount').textContent = userData.noticeCount || 0;
    }

    // 5. 渲染做题记录
    function renderRecordList() {
        const recordList = document.getElementById('recordList');
        if (!recordData.length) {
            recordList.innerHTML = '<div class="text-center text-muted py-3">暂无做题记录</div>';
            return;
        }

        let html = '';
        recordData.forEach(item => {
            // 状态文本和附加信息
            let statusText = '';
            let extraInfo = '';
            switch (item.status) {
                case 'ac':
                    statusText = `<small class="text-success"><i class="fas fa-check me-1"></i>通过 (AC)</small>`;
                    extraInfo = `<span class="ms-2 text-muted">耗时: ${item.costTime} | 内存: ${item.memory}</span>`;
                    break;
                case 'wa':
                    statusText = `<small class="text-danger"><i class="fas fa-times me-1"></i>答案错误 (WA)</small>`;
                    extraInfo = `<span class="ms-2 text-muted">用例通过率: ${item.passRate}</span>`;
                    break;
                case 'tle':
                    statusText = `<small class="text-warning"><i class="fas fa-clock me-1"></i>超时 (TLE)</small>`;
                    extraInfo = `<span class="ms-2 text-muted">时间限制: ${item.timeLimit}</span>`;
                    break;
                case 're':
                    statusText = `<small class="text-secondary"><i class="fas fa-exclamation-triangle me-1"></i>运行错误 (RE)</small>`;
                    extraInfo = `<span class="ms-2 text-muted">${item.errorMsg}</span>`;
                    break;
            }

            html += `
            <div class="record-item">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <div>
                        <span class="record-status status-${item.status}"></span>
                        <span>${item.id} - ${item.title}</span>
                    </div>
                    <small class="text-muted">${item.time}</small>
                </div>
                ${statusText}${extraInfo}
            </div>
            `;
        });
        recordList.innerHTML = html;
    }

    // 6. 渲染轮播图
    function renderCarousel() {
        const indicators = document.getElementById('carouselIndicators');
        const inner = document.getElementById('carouselInner');
        
        if (!carouselData.length) {
            inner.innerHTML = `
            <div class="carousel-item active">
                <img src="https://picsum.photos/id/180/1920/1080" class="d-block w-100" alt="暂无轮播图" />
                <div class="carousel-caption d-none d-md-block">
                    <h5>暂无轮播内容</h5>
                </div>
            </div>
            `;
            indicators.innerHTML = '';
            return;
        }

        // 渲染指示器
        let indicatorHtml = '';
        // 渲染轮播项
        let carouselHtml = '';

        carouselData.forEach((item, index) => {
            indicatorHtml += `
            <button type="button" data-mdb-target="#ojCarousel" data-mdb-slide-to="${index}" 
                    class="${index === 0 ? 'active' : ''}" ${index === 0 ? 'aria-current="true"' : ''}></button>
            `;

            carouselHtml += `
            <div class="carousel-item ${index === 0 ? 'active' : ''}">
                <img src="${item.img}" class="d-block w-100" alt="${item.title}" />
                <div class="carousel-caption d-none d-md-block">
                    <h5>${item.title}</h5>
                    <p>${item.desc}</p>
                </div>
            </div>
            `;
        });

        indicators.innerHTML = indicatorHtml;
        inner.innerHTML = carouselHtml;
    }

    // 7. 渲染日历
    function renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        document.getElementById('calendarMonth').textContent = `${currentYear}年${currentMonth}月`;

        // 计算当月第一天是周几、当月总天数
        const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0-6（日-六）
        const totalDays = new Date(currentYear, currentMonth, 0).getDate(); // 当月总天数

        // 拼接日历HTML
        let html = '';
        // 星期标题
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(day => {
            html += `<div class="calendar-day weekday">${day}</div>`;
        });

        // 补全月初空白
        for (let i = 0; i < firstDay; i++) {
            html += `<div class="calendar-day"></div>`;
        }

        // 渲染日期
        const today = new Date();
        const isCurrentMonth = today.getFullYear() === currentYear && today.getMonth() + 1 === currentMonth;
        
        for (let day = 1; day <= totalDays; day++) {
            // 判断是否是今天
            const isToday = isCurrentMonth && today.getDate() === day;
            // 获取当日做题数
            const doneCount = calendarData[day] || 0;
            // 计算颜色等级（0-4）
            let level = 0;
            if (doneCount >= 1 && doneCount <= 2) level = 1;
            else if (doneCount >= 3 && doneCount <= 5) level = 2;
            else if (doneCount >= 6 && doneCount <= 10) level = 3;
            else if (doneCount > 10) level = 4;

            html += `
            <div class="calendar-day level-${level} ${isToday ? 'today' : ''}">
                ${day}
            </div>
            `;
        }

        calendarGrid.innerHTML = html;
    }

    // 8. 切换日历月份
    function changeCalendarMonth(step) {
        currentMonth += step;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        } else if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
        }

        // 请求新月份的日历数据
        fetch(`/api/calendar/${currentYear}/${currentMonth}`)
            .then(res => res.json())
            .then(data => {
                calendarData = data;
                renderCalendar();
            })
            .catch(error => {
                console.error('日历数据加载失败:', error);
                // 失败时用空数据
                calendarData = {};
                renderCalendar();
            });
    }
