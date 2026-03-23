# 贪吃蛇游戏开发计划

## 一、需求分析

### 1.1 核心功能需求

| 功能模块 | 需求描述 | 优先级 |
|---------|---------|--------|
| 蛇的移动 | 通过方向键控制蛇上下左右移动，不能反向移动 | P0 |
| 食物生成 | 随机位置生成食物，不与蛇身重叠 | P0 |
| 吃食物 | 蛇头碰到食物时增长身体，分数+10 | P0 |
| 碰撞检测 | 检测撞墙和撞自身，触发游戏结束 | P0 |
| 计分系统 | 实时显示当前分数，记录最高分 | P1 |
| 游戏状态 | 开始、暂停、结束、重新开始 | P1 |

### 1.2 界面需求

- **游戏画布**: 400×400像素，网格化显示（20×20格）
- **分数面板**: 顶部显示当前分数和最高分
- **控制按钮**: 开始、暂停、重新开始
- **游戏结束弹窗**: 显示最终分数和重新开始选项
- **操作说明**: 底部显示控制方式

### 1.3 交互需求

- **键盘控制**: 方向键或 WASD 控制移动
- **移动端**: 支持触屏滑动或虚拟方向键
- **速度调节**: 提供慢/中/快三档速度选择

---

## 二、技术方案

### 2.1 技术栈

| 技术 | 用途 | 说明 |
|-----|------|------|
| HTML5 | 页面结构 | 语义化标签 |
| CSS3 | 样式美化 | Flex布局、渐变、动画 |
| Canvas API | 游戏渲染 | 2D上下文绘制 |
| JavaScript | 游戏逻辑 | ES6+ 语法 |
| localStorage | 数据持久化 | 存储最高分 |

### 2.2 游戏架构

```
snake-game/
├── index.html      # 主页面
├── css/
│   └── style.css   # 样式文件
└── js/
    ├── game.js     # 游戏核心逻辑
    ├── snake.js    # 蛇类定义
    ├── food.js     # 食物类定义
    └── utils.js    # 工具函数
```

### 2.3 核心类设计

#### Snake 类
```javascript
class Snake {
    constructor() {
        this.body = [{x: 10, y: 10}];  // 蛇身数组
        this.direction = 'right';       // 当前方向
        this.nextDirection = 'right';   // 下一帧方向
    }
    move() { /* 移动逻辑 */ }
    grow() { /* 增长逻辑 */ }
    checkCollision(gridSize) { /* 碰撞检测 */ }
    changeDirection(newDir) { /* 改变方向 */ }
}
```

#### Food 类
```javascript
class Food {
    constructor(gridSize) {
        this.position = {x: 0, y: 0};
        this.generate(snakeBody);  // 随机生成位置
    }
    generate(snakeBody) { /* 确保不生成在蛇身上 */ }
}
```

#### Game 类
```javascript
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.snake = new Snake();
        this.food = new Food();
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        this.speed = 150;  // 毫秒/帧
        this.isRunning = false;
        this.isPaused = false;
    }
    init() { /* 初始化游戏 */ }
    start() { /* 开始游戏 */ }
    pause() { /* 暂停游戏 */ }
    gameOver() { /* 游戏结束 */ }
    update() { /* 更新游戏状态 */ }
    draw() { /* 绘制画面 */ }
    handleInput(e) { /* 处理输入 */ }
}
```

### 2.4 游戏循环

```javascript
gameLoop() {
    if (!this.isRunning || this.isPaused) return;

    this.update();  // 更新逻辑
    this.draw();    // 渲染画面

    setTimeout(() => {
        requestAnimationFrame(() => this.gameLoop());
    }, this.speed);
}
```

---

## 三、界面设计

### 3.1 布局草图

```
┌─────────────────────────────┐
│  贪吃蛇    分数: 100  最高: 500  │
├─────────────────────────────┤
│                             │
│    ┌──────────────────┐     │
│    │                  │     │
│    │    🎮 游戏区域    │     │
│    │    400×400px     │     │
│    │                  │     │
│    └──────────────────┘     │
│                             │
├─────────────────────────────┤
│  [开始]  [暂停]  [重新开始]  │
├─────────────────────────────┤
│  速度: (○)慢 (●)中 (○)快    │
├─────────────────────────────┤
│  操作说明: ↑↓←→ 或 WASD    │
└─────────────────────────────┘
```

### 3.2 视觉风格

- **背景色**: 深绿色 (#2d5016)
- **画布背景**: 黑色 (#111)
- **蛇头**: 亮绿色 (#0f0)
- **蛇身**: 绿色 (#0a0)
- **食物**: 红色 (#f00)
- **网格线**: 深灰色 (#222)
- **字体**: 无衬线字体，白色

---

## 四、开发计划

### 阶段一：基础框架 (Day 1)
- [ ] 创建 HTML 结构和 Canvas 画布
- [ ] 编写基础 CSS 样式
- [ ] 实现 Snake 类基础功能
- [ ] 实现 Food 类

### 阶段二：核心逻辑 (Day 2)
- [ ] 实现游戏循环
- [ ] 完成移动和转向逻辑
- [ ] 实现吃食物和增长
- [ ] 完成碰撞检测

### 阶段三：交互完善 (Day 3)
- [ ] 添加键盘控制
- [ ] 实现游戏状态管理
- [ ] 添加分数和最高分记录
- [ ] 实现开始/暂停/重启功能

### 阶段四：优化美化 (Day 4)
- [ ] 添加动画效果
- [ ] 优化视觉样式
- [ ] 添加移动端适配
- [ ] 代码优化和测试

---

## 五、关键算法

### 5.1 碰撞检测
```javascript
// 撞墙检测
if (head.x < 0 || head.x >= gridWidth ||
    head.y < 0 || head.y >= gridHeight) {
    return true; // 撞墙
}

// 撞自身检测
for (let i = 1; i < this.body.length; i++) {
    if (head.x === this.body[i].x && head.y === this.body[i].y) {
        return true; // 撞到自己
    }
}
```

### 5.2 食物生成
```javascript
generate(snakeBody) {
    do {
        this.position.x = Math.floor(Math.random() * gridWidth);
        this.position.y = Math.floor(Math.random() * gridHeight);
    } while (snakeBody.some(segment =>
        segment.x === this.position.x &&
        segment.y === this.position.y
    ));
}
```

---

## 六、性能考虑

1. **使用 requestAnimationFrame**: 确保流畅的动画效果
2. **避免内存泄漏**: 及时清理事件监听器
3. **局部重绘**: 只重绘变化区域（可选优化）
4. **防抖处理**: 快速按键时防止反向移动导致自杀

---

## 七、扩展功能（可选）

- [ ] 多种食物类型（加分不同）
- [ ] 关卡系统（速度递增）
- [ ] 音效支持
- [ ] 皮肤切换
- [ ] 双人模式
