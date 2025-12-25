document.querySelector(".btn-lg").addEventListener('click',()=>{
            const username = document.querySelector('#form3Example3').value
            const password = document.querySelector('#form3Example4').value
            
            if (password.length < 8){
                alert('密码必须大于8位')
                return
            }
            
            console.log('提交数据到服务器')
            console.log('username:', username);
            console.log('password:', password);

            axios({
                url:'http://localhost:3000/api/auth/login',
                method: 'POST',
                data: {
                    username:username,
                    password:password
                }
            }).then(result=>{
                console.log(result)
                console.log(result.data.message)
                
                if (result.data.token) {
                    // 保存token到localStorage
                    localStorage.setItem('token', result.data.token);
                    localStorage.setItem('username', result.data.user.username);
                    localStorage.setItem('email', result.data.user.email);
                    localStorage.setItem('userId', result.data.user.id);
                    
                    // 跳转到题目列表页面
                    window.location.href = 'ProblemList.html';
                }
            }).catch(error => {
                console.error('登录失败:', error);
                console.error('错误响应:', error.response);
                const errorMessage = error.response?.data?.message || '登录失败，请检查用户名和密码';
                alert(errorMessage);
            })
        })