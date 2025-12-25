const categoryData = [
    {
        id: 1,
        name: "动态规划",
        icon: "fas fa-project-diagram",
        color: "#0d6efd",
        count: 156,
        description: "动态规划是一种在数学、管理科学、计算机科学、经济学和生物信息学中使用的，通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法。",
        tags: ["DP", "状态转移", "最优解", "记忆化搜索"],
        problems: [
            { id: 1001, title: "斐波那契数列", difficulty: "easy", acceptance: "85.2%", submissions: 12456 },
            { id: 1002, title: "爬楼梯", difficulty: "easy", acceptance: "78.5%", submissions: 9876 },
            { id: 1003, title: "最长递增子序列", difficulty: "medium", acceptance: "62.3%", submissions: 7654 },
            { id: 1004, title: "背包问题", difficulty: "hard", acceptance: "45.6%", submissions: 5432 },
            { id: 1005, title: "买卖股票的最佳时机", difficulty: "medium", acceptance: "58.7%", submissions: 8765 }
        ]
    },
    {
        id: 2,
        name: "字符串处理",
        icon: "fas fa-font",
        color: "#198754",
        count: 128,
        description: "字符串处理是计算机科学中最基础的操作之一，包括字符串的查找、替换、分割、连接等操作。",
        tags: ["字符串", "正则表达式", "滑动窗口", "双指针"],
        problems: [
            { id: 2001, title: "反转字符串", difficulty: "easy", acceptance: "92.1%", submissions: 15678 },
            { id: 2002, title: "最长回文子串", difficulty: "medium", acceptance: "52.3%", submissions: 11234 },
            { id: 2003, title: "字符串匹配", difficulty: "hard", acceptance: "41.2%", submissions: 6789 },
            { id: 2004, title: "有效的括号", difficulty: "easy", acceptance: "88.5%", submissions: 13456 },
            { id: 2005, title: "字符串转换整数", difficulty: "medium", acceptance: "55.8%", submissions: 9876 }
        ]
    },
    {
        id: 3,
        name: "数组",
        icon: "fas fa-th-large",
        color: "#ffc107",
        count: 204,
        description: "数组是最基本的数据结构之一，用于存储相同类型的元素集合。",
        tags: ["数组", "双指针", "排序", "二分查找"],
        problems: [
            { id: 3001, title: "两数之和", difficulty: "easy", acceptance: "89.7%", submissions: 18901 },
            { id: 3002, title: "三数之和", difficulty: "medium", acceptance: "56.4%", submissions: 12345 },
            { id: 3003, title: "旋转数组", difficulty: "easy", acceptance: "72.3%", submissions: 10987 },
            { id: 3004, title: "搜索旋转排序数组", difficulty: "hard", acceptance: "45.1%", submissions: 7890 },
            { id: 3005, title: "合并区间", difficulty: "medium", acceptance: "61.5%", submissions: 8765 }
        ]
    },
    {
        id: 4,
        name: "链表",
        icon: "fas fa-link",
        color: "#dc3545",
        count: 89,
        description: "链表是一种线性数据结构，每个元素都是一个节点，包含数据和指向下一个节点的指针。",
        tags: ["链表", "双指针", "递归", "哈希表"],
        problems: [
            { id: 4001, title: "反转链表", difficulty: "easy", acceptance: "85.6%", submissions: 11234 },
            { id: 4002, title: "合并两个有序链表", difficulty: "easy", acceptance: "82.3%", submissions: 9876 },
            { id: 4003, title: "环形链表", difficulty: "medium", acceptance: "65.8%", submissions: 8765 },
            { id: 4004, title: "相交链表", difficulty: "easy", acceptance: "70.2%", submissions: 7654 },
            { id: 4005, title: "删除链表的倒数第N个节点", difficulty: "medium", acceptance: "62.1%", submissions: 6543 }
        ]
    },
    {
        id: 5,
        name: "树结构",
        icon: "fas fa-tree",
        color: "#6f42c1",
        count: 145,
        description: "树是一种非线性数据结构，由节点和边组成，具有层次结构。",
        tags: ["树", "二叉树", "DFS", "BFS"],
        problems: [
            { id: 5001, title: "二叉树的前序遍历", difficulty: "easy", acceptance: "88.9%", submissions: 10987 },
            { id: 5002, title: "二叉树的中序遍历", difficulty: "easy", acceptance: "87.6%", submissions: 10234 },
            { id: 5003, title: "二叉树的后序遍历", difficulty: "easy", acceptance: "86.3%", submissions: 9876 },
            { id: 5004, title: "二叉树的层序遍历", difficulty: "medium", acceptance: "72.5%", submissions: 8765 },
            { id: 5005, title: "二叉树的最大深度", difficulty: "easy", acceptance: "89.2%", submissions: 11234 }
        ]
    },
    {
        id: 6,
        name: "图论",
        icon: "fas fa-network-wired",
        color: "#fd7e14",
        count: 76,
        description: "图论是数学的一个分支，研究由顶点和边组成的图的性质和应用。",
        tags: ["图", "DFS", "BFS", "最短路径"],
        problems: [
            { id: 6001, title: "岛屿数量", difficulty: "medium", acceptance: "68.7%", submissions: 7890 },
            { id: 6002, title: "最小生成树", difficulty: "hard", acceptance: "45.2%", submissions: 4567 },
            { id: 6003, title: "最短路径", difficulty: "medium", acceptance: "61.5%", submissions: 5678 },
            { id: 6004, title: "拓扑排序", difficulty: "hard", acceptance: "48.3%", submissions: 3456 },
            { id: 6005, title: "图的遍历", difficulty: "medium", acceptance: "72.1%", submissions: 6789 }
        ]
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // 渲染分类网格
    renderCategoryGrid();
});

// 渲染分类网格
function renderCategoryGrid() {
    const categoryGrid = document.getElementById('categoryGrid');
    
    let html = '';
    categoryData.forEach(category => {
        html += `
        <div class="category-card" onclick="showCategoryDetail(${category.id})">
            <div class="category-card-header" style="background-color: ${category.color}15;">
                <div class="category-icon" style="color: ${category.color};">
                    <i class="${category.icon}"></i>
                </div>
                <div class="category-title">${category.name}</div>
                <div class="category-count">${category.count} 道题目</div>
            </div>
            <div class="category-card-body">
                <div class="category-description">${category.description}</div>
                <div class="category-tags">
                    ${category.tags.map(tag => `<span class="category-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
        `;
    });
    
    categoryGrid.innerHTML = html;
}

// 显示分类详情
function showCategoryDetail(categoryId) {
    const category = categoryData.find(c => c.id === categoryId);
    if (!category) return;
    
    // 隐藏分类网格，显示分类详情
    document.getElementById('categoryGrid').style.display = 'none';
    document.getElementById('categoryDetail').style.display = 'block';
    
    // 渲染分类详情
    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <div class="detail-title">${category.name} - ${category.count} 道题目</div>
        <div class="problem-list">
            ${category.problems.map(problem => `
                <div class="problem-item">
                    <div class="problem-header">
                        <div class="problem-title">${problem.title}</div>
                        <span class="problem-difficulty ${problem.difficulty}">
                            ${problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                        </span>
                    </div>
                    <div class="problem-stats">
                        <div class="problem-stat-item">
                            <i class="fas fa-check-circle"></i>
                            <span>通过率: ${problem.acceptance}</span>
                        </div>
                        <div class="problem-stat-item">
                            <i class="fas fa-paper-plane"></i>
                            <span>提交: ${problem.submissions}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function showCategoryGrid() {
    document.getElementById('categoryDetail').style.display = 'none';
    document.getElementById('categoryGrid').style.display = 'grid';
}