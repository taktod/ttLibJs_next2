export declare class BufferPlayer {
    private context;
    private gainNode;
    private startPos;
    private isStartPlaying;
    private pts;
    private holdPcm16Buffers;
    private holdAudioBuffers;
    private channelNum;
    private sampleRate;
    /**
     * コンストラクタ
     * @param context    動作対象コンテキスト
     * @param sampleRate 動作サンプルレート
     * @param channelNum 動作チャンネル数
     */
    constructor(context: AudioContext, sampleRate: number, channelNum: number);
    /**
     * 動作nodeを参照します。
     * @return AudioContext
     */
    refNode(): AudioNode;
    /**
     * 内部動作の開始位置を参照します。
     */
    refStartPos(): number;
    /**
     * AudioBufferを再生queueにまわします。
     * @param buffer      再生するbuffer
     * @param nonCopyMode bufferをそのまま利用するかあらたにcreateBufferするかの指定
     */
    queueBuffer(buffer: AudioBuffer, nonCopyMode: boolean): void;
    queueInt16Array2(pcm: Int16Array, nonCopyMode: boolean): void;
    private processPlay();
    /**
     * int16Arrayのpcmデータを再生にまわします。
     * @param pcm        再生するpcm
     * @param length     pcmのサンプル数
     * @param sampleRate サンプルレート
     * @param channelNum チャンネル数
     */
    queueInt16Array(pcm: Int16Array, length: number, sampleRate: number, channelNum: number): void;
    /**
     * 閉じる
     */
    close(): void;
    test(): void;
}
