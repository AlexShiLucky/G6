import EventEmitter from '@antv/event-emitter';
import { AnimateCfg, Point } from '@antv/g-base/lib/types';
import Graph from '@g6/graph/graph';
import { EdgeConfig, GraphData, IG6GraphEvent, Item, ITEM_TYPE, ModelConfig, ModelStyle, NodeConfig, Padding, ShapeStyle } from '@g6/types'
import { IEdge, IItemBase, INode } from './item';

export interface IModeOption {
  type: string;
  delegate?: boolean;
  delegateStyle?: object;
  updateEdge?: boolean;
  shouldUpdate?: (e: IG6GraphEvent) => boolean;
}

export type IModeType = string | IModeOption

export interface IMode {
  default?: IModeType[]
  [key: string]: IModeType[]
}

export interface ILayoutOptions {
  type: string;
}

export interface GraphAnimateConfig extends AnimateCfg {
  /**
   * 回调函数，用于自定义节点运动路径。
   */
  onFrame?: (item: IItemBase, ratio: number, data?: GraphData, originAttrs?: ShapeStyle) => unknown;
}
export interface GraphOptions {
  /**
   * 图的 DOM 容器，可以传入该 DOM 的 id 或者直接传入容器的 HTML 节点对象
   */
  container: string | HTMLElement;
  /**
   * 指定画布宽度，单位为 'px'
   */
  width: number;
  /**
   * 指定画布高度，单位为 'px'
   */
  height: number;
  /**
   * 渲染引擎，支持canvas和svg。
   */
  renderer?: 'canvas' | 'svg';

  fitView?: boolean;

  layout?: ILayoutOptions;

  /**
   * 图适应画布时，指定四周的留白。
   * 可以是一个值, 例如：fitViewPadding: 20
   * 也可以是一个数组，例如：fitViewPadding: [20, 40, 50,20]
   * 当指定一个值时，四边的边距都相等，当指定数组时，数组内数值依次对应 上，右，下，左四边的边距。
   */
  fitViewPadding?: Padding;
  /**
   * 各种元素是否在一个分组内，决定节点和边的层级问题，默认情况下所有的节点在一个分组中，所有的边在一个分组中，当这个参数为 false 时，节点和边的层级根据生成的顺序确定。
   * 默认值：true
   */
  groupByTypes?: boolean;

  // 是否有向图
  directed?: boolean;

  groupStyle?: {
    style?: {
      [key: string]: ShapeStyle
    };
  };

  /**
   * 当图中元素更新，或视口变换时，是否自动重绘。建议在批量操作节点时关闭，以提高性能，完成批量操作后再打开，参见后面的 setAutoPaint() 方法。
   * 默认值：true
   */
  autoPaint?: boolean;

  /**
   * 设置画布的模式。详情可见G6中的Mode文档。
   */
  modes?: IMode;

  /**
   * 默认状态下节点的配置，比如 shape, size, color。会被写入的 data 覆盖。
   */
  defaultNode?: {
    shape?: string,
    size?: string,
    color?: string,
  } & ModelStyle;

  /**
   * 默认状态下边的配置，比如 shape, size, color。会被写入的 data 覆盖。
   */
  defaultEdge?: {
    shape?: string,
    size?: string,
    color?: string,
  } & ModelStyle;

  nodeStateStyles?: ModelStyle;

  edgeStateStyles?: ModelStyle;

  /**
   * 向 graph 注册插件。插件机制请见：plugin
   */
  plugins?: any[];
  /**
   * 是否启用全局动画。
   */
  animate?: boolean;

  /**
   * 动画配置项，仅在animate为true时有效。
   */
  animateCfg?: GraphAnimateConfig;
  /**
   * 最小缩放比例
   * 默认值 0.2
   */
  minZoom?: number;
  /**
   * 最大缩放比例
   * 默认值 10
   */
  maxZoom?: number;
  /**
   * 像素比率
   * 默认值 1.0
   */
  pixelRatio?: number;

  groupType?: string;

  /**
   * Edge 是否连接到节点中间
   */
  linkCenter?: boolean;
}

// Graph 配置项中 state 的类型
export interface IStates {
  [key: string]: INode[]
}
export interface IGraph extends EventEmitter {
  getDefaultCfg(): GraphOptions;
  get<T = any>(key: string): T;
  set<T = any>(key: string | object, value?: T): Graph;
  findById(id: string): Item;
  translate(dx: number, dy: number): void;
  zoom(ratio: number, center: Point): void;

  /**
   * 将屏幕坐标转换为视口坐标
   * @param {number} clientX 屏幕 x 坐标
   * @param {number} clientY 屏幕 y 坐标
   * @return {Point} 视口坐标
   */
  getPointByClient(clientX: number, clientY: number): Point;

  /**
   * 将视口坐标转换为屏幕坐标
   * @param {number} x 视口x坐标
   * @param {number} y 视口y坐标
   * @return {object} 视口坐标
   */
  getClientByPoint(x: number, y: number): Point;

  /**
   * 将画布坐标转换为视口坐标
   * @param {number} canvasX 画布 x 坐标
   * @param {number} canvasY 画布 y 坐标
   * @return {Point} 视口坐标
   */
  getPointByCanvas(canvasX: number, canvasY: number): Point;

  /**
   * 将视口坐标转换为画布坐标
   * @param {number} x 视口 x 坐标
   * @param {number} y 视口 y 坐标
   * @return {Point} 画布坐标
   */
  getCanvasByPoint(x: number, y: number): Point;

  /**
   * 设置是否在更新/刷新后自动重绘
   * @param {boolean} auto 自动重绘
   */
  setAutoPaint(auto: boolean): void;

  /**
   * 仅画布重新绘制
   */
  paint(): void;

  /**
   * 刷新元素
   * @param {Item} item 元素id或元素实例
   */
  refreshItem(item: Item): void;

  /**
   * 删除元素
   * @param {Item} item 元素id或元素实例
   */
  removeItem(item: Item): void;

  /**
   * 删除元素
   * @param {Item} item 元素id或元素实例
   */
  remove(item: Item): void;

  /**
   * 新增元素 或 节点分组
   * @param {string} type 元素类型(node | edge | group)
   * @param {ModelConfig} model 元素数据模型
   * @return {Item} 元素实例
   */
  addItem(type: ITEM_TYPE, model: ModelConfig): Item;

  add(type: ITEM_TYPE, model: ModelConfig): Item;

  /**
   * 更新元素
   * @param {Item} item 元素id或元素实例
   * @param {ModelConfig} cfg 需要更新的数据
   */
  updateItem(item: Item, cfg: ModelConfig): void;

  update(item: Item, cfg: ModelConfig): void;

  /**
   * 设置元素状态
   * @param {Item} item 元素id或元素实例
   * @param {string} state 状态
   * @param {boolean} enabled 是否启用状态
   */
  setItemState(item: Item, state: string, enabled: boolean): void;

  /**
   * 设置视图初始化数据
   * @param {GraphData} data 初始化数据
   */
  data(data: GraphData): void;

  /**
   * 当源数据在外部发生变更时，根据新数据刷新视图。但是不刷新节点位置
   */
  refresh(): void;

  /**
   * 根据 graph 上的 animateCfg 进行视图中节点位置动画接口
   */
  positionsAnimate(): void;

  /**
   * 当节点位置在外部发生改变时，刷新所有节点位置，重计算边
   */
  refreshPositions(): void;

  /**
   * 根据data接口的数据渲染视图
   */
  render(): void;

  /**
   * 获取当前图中所有节点的item实例
   */
  getNodes(): INode[];

  /**
   * 获取当前图中所有边的item实例
   */
  getEdges(): IEdge[];

  /**
   * 获取当前视口伸缩比例
   * @return {number} 比例
   */
  getZoom(): number;

  /**
   * 获取当前的行为模式
   */
  getCurrentMode(): string;

  /**
   * 切换行为模式
   * @param {string} mode 指定模式
   */
  setMode(mode: string): Graph;

  isAnimating(): boolean;

  stopAnimate(): void;

  /**
   * 清除画布元素
   */
  clear(): Graph;

  /**
   * 根据数据渲染群组
   * @param {GraphData} data 渲染图的数据
   * @param {string} groupType group类型
   */
  renderCustomGroup(data: GraphData, groupType: string): void;

  /**
   * 接收数据进行渲染
   * @Param {GraphData} data 初始化数据
   */
  read(data: GraphData): void;

  /**
   * 更改源数据，根据新数据重新渲染视图
   * @param {GraphData} data 源数据
   * @return {object} this
   */
  changeData(data: GraphData): Graph;

  /**
   * 导出图数据
   * @return {GraphData} data
   */
  save(): GraphData;

  /**
   * 改变画布大小
   * @param  {number} width  画布宽度
   * @param  {number} height 画布高度
   * @return {Graph} this
   */
  changeSize(width: number, height: number): Graph;

  /**
   * 清理元素多个状态
   * @param {string|Item} item 元素id或元素实例
   * @param {String[]} states 状态
   */
  clearItemStates(item: Item, states: string[]): void;

  /**
   * 设置各个节点样式，以及在各种状态下节点 keyShape 的样式。
   * 若是自定义节点切在各种状态下
   * graph.node(node => {
   *  return {
   *    {
   *       shape: 'rect',
   *      label: node.id,
   *       style: { fill: '#666' },
   *      stateStyles: {
   *         selected: { fill: 'blue' },
   *         custom: { fill: 'green' }
   *       }
   *     }
   *  }
   * });
   * @param {function} nodeFn 指定每个节点样式
   */
  node(nodeFn: (config: NodeConfig) => NodeConfig): void;

  /**
   * 设置各个边样式
   * @param {function} edgeFn 指定每个边的样式,用法同 node
   */
  edge(edgeFn: (config: EdgeConfig) => EdgeConfig): void;
  /**
   * 平移画布到某点
   * @param {number} x 水平坐标
   * @param {number} y 垂直坐标
   */
  moveTo(x: number, y: number): void;

  /**
   * 根据对应规则查找单个元素
   * @param {ITEM_TYPE} type 元素类型(node | edge | group)
   * @param {(item: T, index: number) => T} fn 指定规则
   * @return {T} 元素实例
   */
  find<T = IItemBase>(type: ITEM_TYPE, fn: (item: T, index: number) => T): T;

  /**
   * 查找所有满足规则的元素
   * @param {string} type 元素类型(node|edge)
   * @param {string} fn 指定规则
   * @return {array} 元素实例
   */
  findAll<T = IItemBase>(type: ITEM_TYPE, fn: (item: T, index: number) => T): T[];

  /**
   * 查找所有处于指定状态的元素
   * @param {string} type 元素类型(node|edge)
   * @param {string} state z状态
   * @return {object} 元素实例
   */
  // findAllByState<T = IItemBase>(type: ITEM_TYPE, state: string): T[];

  /**
   * 返回图表的 dataUrl 用于生成图片
   */
  // toDataURL(): void;
}