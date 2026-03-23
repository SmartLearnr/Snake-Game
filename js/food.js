class Food {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.position = { x: 0, y: 0 };
    }

    // 生成新食物位置
    generate(snakeBody) {
        let newPosition;
        let isOnSnake;

        do {
            newPosition = {
                x: Math.floor(Math.random() * this.gridSize.width),
                y: Math.floor(Math.random() * this.gridSize.height)
            };

            // 检查是否与蛇身重叠
            isOnSnake = snakeBody.some(segment =>
                segment.x === newPosition.x && segment.y === newPosition.y
            );
        } while (isOnSnake);

        this.position = newPosition;
    }

    // 获取食物位置
    getPosition() {
        return this.position;
    }

    // 检查是否与某个位置重叠
    isAtPosition(x, y) {
        return this.position.x === x && this.position.y === y;
    }
}
