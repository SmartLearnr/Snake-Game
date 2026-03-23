class Snake {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.reset();
    }

    reset() {
        // 初始位置在画布中央
        const startX = Math.floor(this.gridSize.width / 2);
        const startY = Math.floor(this.gridSize.height / 2);

        this.body = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];

        this.direction = 'right';
        this.nextDirection = 'right';
    }

    // 改变方向（防止直接反向）
    changeDirection(newDirection) {
        const opposites = {
            'up': 'down',
            'down': 'up',
            'left': 'right',
            'right': 'left'
        };

        // 防止反向移动
        if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
        }
    }

    // 移动蛇
    move() {
        this.direction = this.nextDirection;

        const head = { ...this.body[0] };

        switch (this.direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }

        // 新头部添加到身体前面
        this.body.unshift(head);

        // 返回新头部位置（用于判断是否吃到食物）
        return head;
    }

    // 增长（不移除尾部）
    grow() {
        // 已经在 move 中添加了头部，这里不做任何事
    }

    // 移除尾部（用于正常移动时）
    shrink() {
        this.body.pop();
    }

    // 获取头部位置
    getHead() {
        return this.body[0];
    }

    // 检测是否撞墙
    checkWallCollision() {
        const head = this.getHead();
        return (
            head.x < 0 ||
            head.x >= this.gridSize.width ||
            head.y < 0 ||
            head.y >= this.gridSize.height
        );
    }

    // 检测是否撞到自身
    checkSelfCollision() {
        const head = this.getHead();
        // 从第二个身体段开始检查
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }

    // 检测是否与某个位置重叠
    isAtPosition(x, y) {
        return this.body.some(segment => segment.x === x && segment.y === y);
    }
}
