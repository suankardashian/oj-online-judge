let currentContestTab = 'ongoing';
let countdownTimers = [];

document.addEventListener('DOMContentLoaded', function() {
    loadUserInfo();
    loadContestData(currentContestTab);
});
function loadUserInfo() {
    const username = localStorage.getItem('username');
    if (username) {
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = username;
        }
    }
}
function switchContestTab(tab) {
    // 清除所有计时器
    countdownTimers.forEach(timer => clearInterval(timer));
    countdownTimers = [];

    // 更新标签状态
    document.querySelectorAll('.contest-tab').forEach(t => {
        t.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // 更新当前竞赛标签并加载数据
    currentContestTab = tab;
    loadContestData(tab);
}

// 加载竞赛数据
function loadContestData(tab) {
    // 模拟竞赛数据
    const contestData = {
        ongoing: [
            {
                id: 1,
                title: "每周算法挑战赛 - 第12期",
                description: "本期竞赛包含5道算法题，涵盖动态规划、图论和字符串处理等知识点。",
                startTime: new Date(Date.now() - 3600000), // 1小时前开始
                endTime: new Date(Date.now() + 7200000), // 2小时后结束
                problems: 5,
                participants: 1245,
                status: "ongoing"
            },
            {
                id: 2,
                title: "数据结构专项训练",
                description: "专注于数据结构的竞赛，包括链表、树、栈和队列等基础数据结构的应用。",
                startTime: new Date(Date.now() - 10800000), // 3小时前开始
                endTime: new Date(Date.now() + 3600000), // 1小时后结束
                problems: 4,
                participants: 892,
                status: "ongoing"
            }
        ],
        upcoming: [
            {
                id: 3,
                title: "月度编程大赛 - 12月",
                description: "月度大型编程竞赛，包含8道不同难度的题目，挑战你的编程极限。",
                startTime: new Date(Date.now() + 86400000), // 1天后开始
                endTime: new Date(Date.now() + 93600000), // 1天1小时后结束
                problems: 8,
                participants: 567,
                status: "upcoming"
            },
            {
                id: 4,
                title: "新手入门竞赛",
                description: "专为编程新手设计的竞赛，题目难度适中，适合初学者参与。",
                startTime: new Date(Date.now() + 172800000), // 2天后开始
                endTime: new Date(Date.now() + 180000000), // 2天2小时后结束
                problems: 3,
                participants: 324,
                status: "upcoming"
            }
        ],
        ended: [
            {
                id: 5,
                title: "每周算法挑战赛 - 第11期",
                description: "本期竞赛包含5道算法题，涵盖贪心算法、二分查找和回溯法等知识点。",
                startTime: new Date(Date.now() - 86400000), // 1天前开始
                endTime: new Date(Date.now() - 64800000), // 1天6小时前结束
                problems: 5,
                participants: 1456,
                status: "ended"
            },
            {
                id: 6,
                title: "动态规划专题竞赛",
                description: "专注于动态规划算法的竞赛，包含多种动态规划类型的题目。",
                startTime: new Date(Date.now() - 172800000), // 2天前开始
                endTime: new Date(Date.now() - 162000000), // 2天3小时前结束
                problems: 4,
                participants: 987,
                status: "ended"
            }
        ]
    };

    renderContestList(contestData[tab]);
}

// 渲染竞赛列表
function renderContestList(contests) {
    const contestList = document.getElementById('contestList');
    
    if (contests.length === 0) {
        contestList.innerHTML = '<div class="text-center text-muted py-3">暂无竞赛</div>';
        return;
    }
    
    let html = '';
    contests.forEach(contest => {
        html += `
        <div class="contest-card">
            <div class="contest-card-header d-flex justify-content-between align-items-center">
                <div class="contest-title">${contest.title}</div>
                <span class="contest-status ${contest.status}">
                    ${contest.status === 'ongoing' ? '进行中' : contest.status === 'upcoming' ? '即将开始' : '已结束'}
                </span>
            </div>
            <div class="contest-card-body">
                <div class="contest-description">${contest.description}</div>
                <div class="contest-meta">
                    <div class="contest-meta-item">
                        <i class="fas fa-clock"></i>
                        <span>开始时间: ${formatDateTime(contest.startTime)}</span>
                    </div>
                    <div class="contest-meta-item">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>结束时间: ${formatDateTime(contest.endTime)}</span>
                    </div>
                    <div class="contest-meta-item">
                        <i class="fas fa-list"></i>
                        <span>题目数量: ${contest.problems}</span>
                    </div>
                    <div class="contest-meta-item">
                        <i class="fas fa-users"></i>
                        <span>参与人数: ${contest.participants}</span>
                    </div>
                </div>
                ${currentContestTab !== 'ended' ? `
                <div class="countdown" id="countdown-${contest.id}">
                    <div class="countdown-unit">
                        <div class="countdown-number">00</div>
                        <div class="countdown-label">天</div>
                    </div>
                    <div class="countdown-unit">
                        <div class="countdown-number">00</div>
                        <div class="countdown-label">时</div>
                    </div>
                    <div class="countdown-unit">
                        <div class="countdown-number">00</div>
                        <div class="countdown-label">分</div>
                    </div>
                    <div class="countdown-unit">
                        <div class="countdown-number">00</div>
                        <div class="countdown-label">秒</div>
                    </div>
                </div>
                ` : ''}
                <div class="contest-actions">
                    ${currentContestTab === 'ongoing' ? `
                    <button class="btn btn-primary">
                        <i class="fas fa-play me-1"></i>参加竞赛
                    </button>
                    ` : currentContestTab === 'upcoming' ? `
                    <button class="btn btn-outline-primary">
                        <i class="fas fa-bell me-1"></i>订阅提醒
                    </button>
                    ` : `
                    <button class="btn btn-outline-secondary">
                        <i class="fas fa-eye me-1"></i>查看结果
                    </button>
                    `}
                    <button class="btn btn-outline-secondary">
                        <i class="fas fa-info-circle me-1"></i>竞赛详情
                    </button>
                </div>
            </div>
        </div>
        `;
    });
    
    contestList.innerHTML = html;
    
    // 初始化倒计时
    if (currentContestTab !== 'ended') {
        contests.forEach(contest => {
            initCountdown(contest.id, contest.endTime);
        });
    }
}

// 格式化日期时间
function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 初始化倒计时
function initCountdown(contestId, endTime) {
    const timerElement = document.getElementById(`countdown-${contestId}`);
    if (!timerElement) return;

    const updateCountdown = () => {
        const now = new Date();
        const diff = endTime - now;
        
        if (diff <= 0) {
            timerElement.innerHTML = '<div class="text-center text-danger">竞赛已结束</div>';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        timerElement.innerHTML = `
        <div class="countdown-unit">
            <div class="countdown-number">${String(days).padStart(2, '0')}</div>
            <div class="countdown-label">天</div>
        </div>
        <div class="countdown-unit">
            <div class="countdown-number">${String(hours).padStart(2, '0')}</div>
            <div class="countdown-label">时</div>
        </div>
        <div class="countdown-unit">
            <div class="countdown-number">${String(minutes).padStart(2, '0')}</div>
            <div class="countdown-label">分</div>
        </div>
        <div class="countdown-unit">
            <div class="countdown-number">${String(seconds).padStart(2, '0')}</div>
            <div class="countdown-label">秒</div>
        </div>
        `;
    };
    
    // 立即更新一次
    updateCountdown();
    
    // 每秒更新一次
    const timer = setInterval(updateCountdown, 1000);
    countdownTimers.push(timer);
}