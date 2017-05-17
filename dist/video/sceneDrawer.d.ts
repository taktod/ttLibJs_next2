export declare class SceneDrawer {
    private yuvGl;
    private yTexture;
    private uTexture;
    private vTexture;
    private width;
    private height;
    /**
     * コンストラクタ
     * @param target 描画対象canvasエレメント
     */
    constructor(target: HTMLCanvasElement);
    /**
     * 描画実施
     * @param y       y要素データ
     * @param yStride y要素データのstride値
     * @param u       u要素データ
     * @param uStride u要素データのstride値
     * @param v       v要素データ
     * @param vStride v要素データのstride値
     * @note 基本yuv420であることを期待します。
     * y要素の縦横サイズがwとhとすると
     * uとv要素の縦横サイズはw/2とh/2になる
     * ただし変換の都合上、データ保持量がちょうどwと同じにならないことがあるため
     * stride値を設定できるようにしました。
     * yStrideとwidth、u及びvStrideとwidth/2の比率は一定であるとしています。
     */
    draw(y: Uint8Array, yStride: number, u: Uint8Array, uStride: number, v: Uint8Array, vStride: number): void;
    /**
     * 閉じる
     */
    close(): void;
}
