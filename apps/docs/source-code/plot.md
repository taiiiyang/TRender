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

- 需要补充 options label domain range interpolate

```javascript
const originScale =  {
	x: "band",
	y: "linear"
}

// 需要根据 channels 重新去推断比例尺
const scales = inferScales(channels, originScale);
// scales = {
// 	x: {
// 		type: "band",
// 		domain,
// 		range,
// 		label,
// 		...options
// 	},
// 	y: {
// 		type: "linear",
// 		domain,
// 		range,
// 		label,
// 		...options
// 	}
// }
```

#### inferScaleType

优先用显式指定，其次看 domain/range，再看数据值；离散→ordinal/dot，时间→time，单值→identity，其余→linear。x/y 上的离散用 dot，其它通道用 ordinal。

#### inferScaleDomain

推断比例尺的定义域

- linear/log/quantize → inferContinuousDomain：连续量需要区间 [min, max]，并支持 zero 让柱/面积从 0 起，读图更直观。
- ordinal/dot/band → inferCategoricalDomain：离散定位或映射需要“唯一类别集合”，保留数据出现顺序以稳定坐标轴标签与颜色映射。
- quantile → inferOrderedDomain：分位数切分依赖可比较序列，对离散集合做去重后排序，保证阈值单调。
- time → inferTimeDomain：时间是连续轴，但应以 Date 边界表达；先取数值范围再转回 Date，确保时间刻度/格式化工作正常。

### 序数色板和分类色板的区别

- 分类色板（categoricalColors）: 用于“无序的离散类别”。特点是颜色彼此区分度高、无明暗/数值递进关系。适用场景：国家/产品/物种等类别对比；比例尺类型通常是离散映射（如 ordinal/band/dot 的类别维度），图例一般是离散色块。
- 序数色板（ordinalColors）: 用于“有序/连续的数值或分段”。颜色沿明度/饱和度单调变化，表达大小、强弱、顺序。适用场景：数值大小、排名、分位/分段（quantile/quantize/threshold）、连续色带端点插值（连续 color 的 [min,max]）。图例一般是渐变/阶梯色带。