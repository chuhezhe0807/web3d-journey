/**
 * 代表类可更新，每一帧调用更新方法
 */
export interface Updatable {
    // 更新方法
    onRender(): void;
}