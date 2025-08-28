## Statistics

### 堆叠

统计函数处理的数据不是我们的原始表格数据，而是一个和每个通道绑定的对象，参考下面的例子

```javascript
// 在 x = 0 的位置堆叠，y 为每一个种类占的值
const raw = [
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 0, y: 3 },
];

// 和每个通道绑定的对象
const data = {
  index: [0, 1, 2], // 三个几何图形
  values: {
    x: [0, 0, 0],
    y: [1, 2, 3],
  },
};
```

### 归一化

归一化其实就是把 y 通道的值都变成了 [0, 1] 这个范围之内。常用于百分比条形图

```javascript
import { createNormalizeY } from "../../src/statistic";
const data = {
  index: [0, 1, 2],
  values: {
    x: [0, 1, 2],
    y1: [2, 4, 6], // 从小到大，表示到零坐标的距离
    y: [10, 10, 10],
  },
};
const normalizeY = createNormalizeY();
// {
//   index: [0, 1, 2],
//   values: {
//     x: [0, 1, 2],
//     y1: [0.2, 0.4, 0.6],
//     y: [1, 1, 1],
//   },
// }
```
