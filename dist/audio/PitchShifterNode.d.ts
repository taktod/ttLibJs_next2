/**
 * 要素としては、
 * grainSize
 * overlapRatio
 * pitchRatio
 * の３つがある。
 * grainが大きくなると、エフェクトが大げさになるが、遅くなる。
 * grainを変更する場合は、scriptProcessorNodeを作り直す必要がある。
 * それ以外のものは、いつでも変更可能。
 * 自動的に更新できるようにするには、connectのし直しがでてくるので
 * grainSizeは固定にしておこうと思う。
 * 初期化時に設定する的なやつ。
 * あとgrainSizeは取得可能なサイズが256の倍数になる。最大8192まで
 *
 * 元となったプロジェクト
 * https://github.com/urtzurd/html-audio
 */
export declare class PitchShifterNode {
    private pitchShifterProcessor;
    private grainSize;
    private pitchRatio;
    private overlapRatio;
    private buffer;
    private grainWindow;
    /**
     * コンストラクタ
     * @param context      動作対象audioContext
     * @param pitchRatio   pitchの変換パラメーター 1.0がそのまま数値があがるとpitchがあがります。
     * @param overlapRatio
     * @param grainSize
     */
    constructor(context: AudioContext, pitchRatio?: number, overlapRatio?: number, grainSize?: number);
    setPitchRatio(value: number): boolean;
    setOverlapRatio(value: number): boolean;
    refNode(): AudioNode;
    close(): void;
    private onAudioProcess(event);
    private hannWindow(length);
    private linearInterpolation(a, b, t);
}
