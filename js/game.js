class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // 网格设置
        this.gridSize = { width: 20, height: 20 };
        this.cellSize = this.canvas.width / this.gridSize.width;

        // 游戏对象
        this.snake = new Snake(this.gridSize);
        this.food = new Food(this.gridSize);

        // 游戏状态
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.speed = 150;
        this.isRunning = false;
        this.isPaused = false;
        this.gameLoopId = null;

        // UI 元素
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.overlay = document.getElementById('gameOverlay');
        this.overlayTitle = document.getElementById('overlayTitle');
        this.overlayText = document.getElementById('overlayText');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');

        // 初始化显示
        this.updateScoreDisplay();
        this.food.generate(this.snake.body);
        this.draw();
    }

    // 初始化游戏
    init() {
        this.bindEvents();
        this.showOverlay('游戏开始', '点击开始按钮开始游戏');
    }

    // 绑定事件
    bindEvents() {
        // 键盘控制
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // 按钮控制
        this.startBtn.addEventListener('click', () => this.start());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());

        // 速度选择
        document.querySelectorAll('input[name="speed"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.speed = parseInt(e.target.value);
            });
        });

        // 移动端控制
        document.querySelectorAll('.mobile-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dir = e.target.dataset.dir;
                if (dir) this.snake.changeDirection(dir);
            });
        });
    }

    // 处理键盘输入
    handleKeydown(e) {
        if (!this.isRunning || this.isPaused) {
            // 未开始或暂停时，空格键开始
            if (e.code === 'Space' && !this.isRunning) {
                e.preventDefault();
                this.start();
                return;
            }
        }

        const keyMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'KeyW': 'up',
            'KeyS': 'down',
            'KeyA': 'left',
            'KeyD': 'right'
        };

        if (keyMap[e.code]) {
            e.preventDefault();
            this.snake.changeDirection(keyMap[e.code]);
        }

        // P 键暂停
        if (e.code === 'KeyP' && this.isRunning) {
            this.togglePause();
        }
    }

    // 开始游戏
    start() {
        this.isRunning = true;
        this.isPaused = false;
        this.hideOverlay();
        this.pauseBtn.disabled = false;
        this.pauseBtn.textContent = '暂停';
        this.gameLoop();
    }

    // 暂停/继续
    togglePause() {
        if (!this.isRunning) return;

        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            this.pauseBtn.textContent = '继续';
            this.showOverlay('游戏暂停', '点击继续按钮返回游戏');
            this.startBtn.textContent = '继续';
        } else {
            this.pauseBtn.textContent = '暂停';
            this.hideOverlay();
            this.gameLoop();
        }
    }

    // 重新开始
    restart() {
        // 重置游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;

        // 重置蛇和食物
        this.snake.reset();
        this.food.generate(this.snake.body);

        // 更新显示
        this.updateScoreDisplay();
        this.draw();

        // 显示开始界面
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = '暂停';
        this.startBtn.textContent = '开始游戏';
        this.showOverlay('游戏开始', '点击开始按钮开始游戏');
    }

    // 游戏结束
    gameOver() {
        this.isRunning = false;
        this.isPaused = false;
        this.pauseBtn.disabled = true;

        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.updateScoreDisplay();
        }

        // 显示游戏结束界面
        this.startBtn.textContent = '重新开始';
        this.showOverlay('游戏结束', `最终得分: ${this.score}`);
    }

    // 游戏主循环
    gameLoop() {
        if (!this.isRunning || this.isPaused) return;

        this.update();
        this.draw();

        setTimeout(() => {
            if (this.isRunning && !this.isPaused) {
                requestAnimationFrame(() => this.gameLoop());
            }
        }, this.speed);
    }

    // 更新游戏状态
    update() {
        // 移动蛇
        const newHead = this.snake.move();

        // 检查是否吃到食物
        if (this.food.isAtPosition(newHead.x, newHead.y)) {
            // 吃到食物，增长并加分
            this.snake.grow();
            this.score += 10;
            this.updateScoreDisplay();

            // 生成新食物
            this.food.generate(this.snake.body);
        } else {
            // 没吃到食物，移除尾部
            this.snake.shrink();
        }

        // 检测碰撞
        if (this.snake.checkWallCollision() || this.snake.checkSelfCollision()) {
            this.gameOver();
        }
    }

    // 绘制游戏画面
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格（可选，调低透明度）
        this.drawGrid();

        // 绘制食物
        this.drawFood();

        // 绘制蛇
        this.drawSnake();
    }

    // 绘制网格
    drawGrid() {
        this.ctx.strokeStyle = '#1a1a1a';
        this.ctx.lineWidth = 1;

        for (let x = 0; x <= this.gridSize.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }

        for (let y = 0; y <= this.gridSize.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
    }

    // 绘制蛇
    drawSnake() {
        this.snake.body.forEach((segment, index) => {
            const x = segment.x * this.cellSize;
            const y = segment.y * this.cellSize;

            if (index === 0) {
                // 蛇头 - 亮绿色
                this.ctx.fillStyle = '#4ecca3';
                this.ctx.shadowColor = '#4ecca3';
                this.ctx.shadowBlur = 10;
            } else {
                // 蛇身 - 渐变绿色
                const greenValue = Math.max(100, 200 - index * 5);
                this.ctx.fillStyle = `rgb(60, ${greenValue}, 130)`;
                this.ctx.shadowBlur = 0;
            }

            // 绘制圆角矩形
            this.roundRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2, 4);
            this.ctx.fill();

            // 蛇头添加眼睛
            if (index === 0) {
                this.drawEyes(segment);
            }
        });

        this.ctx.shadowBlur = 0;
    }

    // 绘制圆角矩形
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    }

    // 绘制蛇头眼睛
    drawEyes(head) {
        const eyeSize = this.cellSize / 5;
        const offset = this.cellSize / 4;

        this.ctx.fillStyle = '#fff';

        let eye1, eye2;

        switch (this.snake.direction) {
            case 'up':
                eye1 = { x: head.x * this.cellSize + offset, y: head.y * this.cellSize + offset };
                eye2 = { x: head.x * this.cellSize + this.cellSize - offset - eyeSize, y: head.y * this.cellSize + offset };
                break;
            case 'down':
                eye1 = { x: head.x * this.cellSize + offset, y: head.y * this.cellSize + this.cellSize - offset - eyeSize };
                eye2 = { x: head.x * this.cellSize + this.cellSize - offset - eyeSize, y: head.y * this.cellSize + this.cellSize - offset - eyeSize };
                break;
            case 'left':
                eye1 = { x: head.x * this.cellSize + offset, y: head.y * this.cellSize + offset };
                eye2 = { x: head.x * this.cellSize + offset, y: head.y * this.cellSize + this.cellSize - offset - eyeSize };
                break;
            case 'right':
                eye1 = { x: head.x * this.cellSize + this.cellSize - offset - eyeSize, y: head.y * this.cellSize + offset };
                eye2 = { x: head.x * this.cellSize + this.cellSize - offset - eyeSize, y: head.y * this.cellSize + this.cellSize - offset - eyeSize };
                break;
        }

        this.ctx.fillRect(eye1.x, eye1.y, eyeSize, eyeSize);
        this.ctx.fillRect(eye2.x, eye2.y, eyeSize, eyeSize);
    }

    // 绘制食物
    drawFood() {
        const pos = this.food.getPosition();
        const x = pos.x * this.cellSize + this.cellSize / 2;
        const y = pos.y * this.cellSize + this.cellSize / 2;
        const radius = this.cellSize / 2 - 2;

        // 发光效果
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 15;

        // 绘制圆形食物
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // 高光
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#ffaaaa';
        this.ctx.beginPath();
        this.ctx.arc(x - radius/3, y - radius/3, radius/3, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 更新分数显示
    updateScoreDisplay() {
        this.scoreElement.textContent = this.score;
        this.highScoreElement.textContent = this.highScore;
    }

    // 显示遮罩层
    showOverlay(title, text) {
        this.overlayTitle.textContent = title;
        this.overlayText.textContent = text;
        this.overlay.classList.remove('hidden');
    }

    // 隐藏遮罩层
    hideOverlay() {
        this.overlay.classList.add('hidden');
    }
}
