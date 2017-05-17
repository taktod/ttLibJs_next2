export declare class SceneCapture {
    private canvas;
    private width;
    private height;
    private sceneGl;
    private captureGl;
    private captureTexture;
    private videoTexture;
    /**
     * コンストラクタ
     * @param width  横サイズ
     * @param height 縦サイズ
     */
    constructor(width: number, height: number);
    /**
     * 描画データを取り出す。
     * @param source 映像ソース canvasかvideoタグ
     * @param target データ設置先yuv420のデータとしてデータが保持されます。
     */
    drain(source: any, target: Uint8Array): boolean;
    /**
     * 閉じます。
     */
    close(): void;
}
