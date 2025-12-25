let currentRankingType = 'daily';

document.addEventListener('DOMContentLoaded', function() {
    // 加载排名数据
    loadRankingData(currentRankingType);
});

// 切换排名类型
function switchRankingType(type) {
    // 更新标签状态
    document.querySelectorAll('.ranking-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // 更新当前排名类型并加载数据
    currentRankingType = type;
    loadRankingData(type);
}

// 加载排名数据
function loadRankingData(type) {
    // 模拟排名数据
    const rankingData = [
        { id: 1, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp", username: "编程大师", points: 3250, solved: 286, submissions: 523, passRate: 54.7 },
        { id: 2, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/3.webp", username: "算法小能手", points: 2980, solved: 256, submissions: 478, passRate: 53.5 },
        { id: 3, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/4.webp", username: "数据结构达人", points: 2870, solved: 245, submissions: 456, passRate: 53.7 },
        { id: 4, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/5.webp", username: "编程小白", points: 2560, solved: 210, submissions: 432, passRate: 48.6 },
        { id: 5, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/6.webp", username: "代码小王子", points: 2450, solved: 198, submissions: 402, passRate: 49.3 },
        { id: 6, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/7.webp", username: "编程小天后", points: 2340, solved: 187, submissions: 389, passRate: 48.1 },
        { id: 7, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/8.webp", username: "算法爱好者", points: 2230, solved: 176, submissions: 378, passRate: 46.6 },
        { id: 8, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/9.webp", username: "数据结构迷", points: 2120, solved: 165, submissions: 367, passRate: 45.0 },
        { id: 9, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/10.webp", username: "编程学习者", points: 2010, solved: 154, submissions: 356, passRate: 43.3 },
        { id: 10, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/11.webp", username: "算法初学者", points: 1900, solved: 143, submissions: 345, passRate: 41.4 },
        { id: 11, avatar: "https://mdbcdn.b-cdn.net/img/new/avatars/1.webp", username: "张三", points: 1250, solved: 86, submissions: 245, passRate: 35.1 }
    ];

    renderRankingTable(rankingData);
}

// 渲染排名表格
function renderRankingTable(rankingData) {
    const tableBody = document.getElementById('rankingTableBody');
    
    let html = '';
    rankingData.forEach((user, index) => {
        // 确定排名样式
        let positionClass = '';
        if (index === 0) positionClass = 'gold';
        else if (index === 1) positionClass = 'silver';
        else if (index === 2) positionClass = 'bronze';
        
        // 检查是否是当前用户
        const isCurrentUser = user.username === '张三';
        
        html += `
        <tr class="ranking-row ${isCurrentUser ? 'highlight' : ''}">
            <td>
                <span class="rank-badge ${positionClass}">${index + 1}</span>
            </td>
            <td>
                <div class="ranking-user-info">
                    <img src="${user.avatar}" alt="${user.username}" class="ranking-avatar">
                    <span class="ranking-username">${user.username}</span>
                </div>
            </td>
            <td>
                <span class="ranking-points">${user.points}</span>
            </td>
            <td>${user.solved}</td>
            <td>${user.submissions}</td>
            <td>${user.passRate}%</td>
        </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}