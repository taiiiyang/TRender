## 绘图模块

### 绘图的整体流程
- 预处理：视图节点继承祖先容器节点的属性，同时合并同一区域的属性。
- 获取通道值：
	- 通过 transforms 函数转换数据，获得需要可视化的表格数据。（对每个值应用坐标系变换）
	- 根据编码 encodings 配置从数据中去提取几何图形每个通道对应的值。（补全各个编码信息）
	- 通过 statsitcs 函数处理获得的通道值，获得最后真正被可视化出来的通道值。（通过统计函数对通道值格式化）
- 创建比例尺：根据当前的通道值以及 scales 配置去推断对应比例尺 种类，定义域和值域的值。
- 创建辅助组件：根据推断出来的比例尺以及 guides 配置去创建对应的辅助元素。
- 创建坐标系：根据 coordinates 配置去创建对应的坐标系。
- 绘制：
	- 绘制辅助组件。
	- 绘制几何元素。

### 各个函数的作用

#### create

统一根据 type 字段动态创建各种对象，包括：

- 几何元素（如 interval、line、area 等）
- 统计变换（如 stackY、normalizeY 等）
- 坐标系（如 cartesian、polar 等）
- 比例尺（如 linear、ordinal、dot 等）
- 引导元素（如 axisX、legendSwatches 等）

#### flow

流转父节点的配置到子节点

#### inferEncodings

encodings 的类型有四种
- value 常量
- constants 常量
- field 取每一列中的固定字段
- transform 对每一行的数据进行转换获取新的一列 

```javascript
const encoding = {
	x: "genre",
	y: "sales",
	fill: "green"
}

// 格式化后的 encodings
const typedEncodings = {
	x: {
		type: "field",
		value: "genre"
	},
	y: {
		type: "field",
		value: "sales"
	},
	fill: {
		type: "constants",
		value: "green"
	}
}
```

#### inferScale
比例尺的创建

- 确定比例尺类型
- 确定值域
- 确定定义域