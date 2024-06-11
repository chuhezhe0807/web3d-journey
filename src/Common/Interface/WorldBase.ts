/**
 * canvas渲染的世界所需要的基本的方法接口
 */
export interface WorldBaseWorkflow {
    /**
     * 初始化，调整相机位置、灯光位置、像场景里面添加模型等
     */
    init(): void;

    /**
     * 加载模型的方法
     */
    loadModel(): void;

    /**
     * 加载纹理的方法
     */
    loadTexture?: () => void;

    /**
     * render 方法，每一帧都会调用
     */
    onRender(): void;

    /**
     * 销毁方法，销毁此实例时调用
     */
    onDispose(): void;
}