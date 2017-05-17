export declare class ScriptPlayer {
    private processorNode;
    private channelNum;
    private totalHoldSampleNum;
    private holdAudioBuffers;
    private holdPcm16Buffers;
    private usingAudioBuffer;
    private usingPcm16Buffer;
    private usingBufferPos;
    isStart: boolean;
    /**
     * コンストラクタ
     * @param context 動作対象AudioContext
     * @param channelNum 動作チャンネル数 1:モノラル 2:ステレオ
     */
    constructor(context: AudioContext, channelNum: number);
    /**
     * AudioNode参照
     * @return AudioNode
     */
    refNode(): AudioNode;
    /**
     * bufferを再生queueにいれる。
     * @param buffer 再生させたいaudioBuffer
     * @param nonCopyMode trueなら入力bufferをそのまま使う falseならデータをコピーして使う。
     */
    queueBufer(buffer: AudioBuffer, nonCopyMode: boolean): void;
    /**
     * int16Arrayのpcmを再生queueにいれる。
     * @param pcm         pcmデータ
     * @param nonCopyMode データをコピーするかどうかフラグ
     */
    queueInt16Array(pcm: Int16Array, nonCopyMode: boolean): void;
    private _onaudioprocess(ev);
    private _onBufferProcess(outputBuffer);
    private _onPcm16Process(outputBuffer);
    /**
     * 後始末
     */
    close(): void;
}
