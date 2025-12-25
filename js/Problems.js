    document.addEventListener('DOMContentLoaded', function() {
        // 加载用户信息
        loadUserInfo();
        // 加载题目数据
        loadProblemData();
    });
    
    // 加载用户信息
    function loadUserInfo() {
        const username = localStorage.getItem('username');
        if (username) {
            document.getElementById('userName').textContent = username;
        }
    }

    // 加载题目数据
    function loadProblemData(searchTerm = '', difficulty = '', category = '', page = 1) {
        // 显示加载状态
        const problemListContainer = document.getElementById('problemList');
        problemListContainer.innerHTML = '<div class="text-center text-muted py-3">加载中...</div>';
        
        // 构建查询参数
        const params = new URLSearchParams();
        params.append('page', page);
        if (searchTerm) params.append('search', searchTerm);
        if (difficulty) params.append('difficulty', difficulty);
        if (category) params.append('category', category);
        
        // 调用后端API获取题目数据
        fetch(`http://localhost:3000/api/problems?${params.toString()}`)
            .then(response => response.json())
            .then(data => {
                // 转换数据格式以匹配现有渲染函数
                const formattedProblems = data.problems.map(problem => ({
                    id: problem.id,
                    title: problem.title,
                    description: problem.description,
                    difficulty: problem.difficulty,
                    passRate: problem.pass_rate,
                    category: problem.category,
                    solvedCount: problem.solved_count,
                    attemptCount: problem.attempt_count
                }));
                
                renderProblemList(formattedProblems);
                renderPagination(page, data.pagination.pages);
            })
            .catch(error => {
                console.error('加载题目数据失败:', error);
                problemListContainer.innerHTML = '<div class="text-center text-muted py-3">加载题目失败，请稍后重试</div>';
            });
    }

    // 渲染题目列表
    function renderProblemList(problems) {
        const problemListContainer = document.getElementById('problemList');

        if (!problems.length) {
            problemListContainer.innerHTML = '<div class="text-center text-muted py-3">暂无符合条件的题目</div>';
            return;
        }

        let html = '';
        problems.forEach(problem => {
            html += `
            <div class="problem-item">
                <div class="problem-info">
                    <div class="problem-title">
                        <span class="problem-id">${problem.id}.</span>
                        <a href="Problem.html?id=${problem.id}" class="problem-name text-primary text-decoration-none">${problem.title}</a>
                    </div>
                    <div class="problem-description">${problem.description}</div>
                    <div class="problem-meta">
                        <span><i class="fas fa-tags me-1"></i>${problem.category}</span>
                        <span><i class="fas fa-check-circle me-1"></i>${problem.solvedCount}人通过</span>
                        <span><i class="fas fa-play-circle me-1"></i>${problem.attemptCount}次尝试</span>
                    </div>
                </div>
                <div class="problem-stats">
                    <span class="difficulty-badge difficulty-${problem.difficulty}">
                        ${problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                    <span class="pass-rate">通过率 ${problem.passRate}%</span>
                    <a href="Problem.html?id=${problem.id}" class="btn btn-sm btn-primary">
                        <i class="fas fa-pencil-alt me-1"></i>开始做题
                    </a>
                </div>
            </div>
            `;
        });
        problemListContainer.innerHTML = html;
    }

    // 渲染分页
    function renderPagination(currentPage, totalPages) {
        const paginationContainer = document.getElementById('pagination');
        let html = '';

        // 上一页按钮
        html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Previous" onclick="changePage(${currentPage - 1})">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
        `;

        // 页码按钮
        for (let i = 1; i <= totalPages; i++) {
            html += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})"><span>${i}</span></a>
            </li>
            `;
        }

        // 下一页按钮
        html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" aria-label="Next" onclick="changePage(${currentPage + 1})">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
        `;

        paginationContainer.innerHTML = html;
    }

    // 应用筛选
    function applyFilters() {
        const searchTerm = document.getElementById('searchInput').value;
        const difficulty = document.getElementById('difficultyFilter').value;
        const category = document.getElementById('categoryFilter').value;
        
        console.log('应用筛选条件:', { searchTerm, difficulty, category });
        // 调用loadProblemData函数，传递筛选条件
        loadProblemData(searchTerm, difficulty, category);
    }

    // 切换页码
    function changePage(page) {
        const searchTerm = document.getElementById('searchInput').value;
        const difficulty = document.getElementById('difficultyFilter').value;
        const category = document.getElementById('categoryFilter').value;
        
        console.log('切换到第', page, '页');
        // 调用loadProblemData函数，传递当前的筛选条件和页码
        loadProblemData(searchTerm, difficulty, category, page);
    }