 document.addEventListener('DOMContentLoaded', function() {
            loadUserData();
            loadRecentRecords();
        });

        function loadUserData() {
            const username = localStorage.getItem('username') || '未知用户';
            const email = localStorage.getItem('email') || 'unknown@example.com';
            const userId = localStorage.getItem('userId');
            
            const userData = {
                avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp",
                name: username,
                email: email,
                stats: {
                    totalProblems: 128,
                    solvedProblems: 86,
                    acRate: 67,
                    rank: 142
                }
            };
            document.getElementById('profileAvatar').src = userData.avatar;
            document.getElementById('profileName').textContent = userData.name;
            document.getElementById('profileEmail').textContent = userData.email;
            document.getElementById('userAvatar').src = userData.avatar;
            document.getElementById('userName').textContent = userData.name;

            document.getElementById('totalProblems').textContent = userData.stats.totalProblems;
            document.getElementById('solvedProblems').textContent = userData.stats.solvedProblems;
            document.getElementById('acRate').textContent = userData.stats.acRate + '%';
            document.getElementById('rank').textContent = userData.stats.rank;
        }


        function loadRecentRecords() {
            // 模拟最近做题记录数据
            const recentRecords = [
                { id: 1001, title: "两数之和", status: "ac", time: "10分钟前", costTime: "92ms", memory: "3.1MB" },
                { id: 1002, title: "两数相加", status: "wa", time: "35分钟前", passRate: "75%" },
                { id: 1003, title: "无重复字符的最长子串", status: "tle", time: "1小时前", timeLimit: "1s" },
                { id: 1004, title: "寻找两个正序数组的中位数", status: "re", time: "昨天 18:25", errorMsg: "数组越界" },
                { id: 1005, title: "最长回文子串", status: "ac", time: "昨天 15:40", costTime: "148ms", memory: "4.2MB" }
            ];

            const recordsContainer = document.getElementById('recentRecords');

            if (!recentRecords.length) {
                recordsContainer.innerHTML = '<div class="text-center text-muted py-3">暂无做题记录</div>';
                return;
            }

            let html = '';
            recentRecords.forEach(item => {
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
            recordsContainer.innerHTML = html;
        }

        function logout() {
            if (confirm('确定要退出登录吗？')) {
                console.log('用户已退出登录');
                // 退出成功后跳转到登录页面
                window.location.href = 'Login.html';
            }
        }