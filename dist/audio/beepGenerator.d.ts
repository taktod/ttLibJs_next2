export declare class BeepGenerator {
    private pos;
    private targetHz;
    private sampleRate;
    private channelNum;
    amplitude: number;
    /**
     * コンストラクタ
     * @param targetHz   再生音の周波数 440がラの音
     * @param sampleRate 動作サンプルレート
     * @param channelNum 動作チャンネル数 1:モノラル 2:ステレオ
     */
    constructor(targetHz: number, sampleRate: number, channelNum: number);
    /**
     * 指定ミリ秒のデータを生成する。
     * @param duration ミリ秒
     * @return 作成pcmデータ
     */
    makeBeepByMilisec(duration: number): Int16Array;
    /**
     * 指定サンプル数のデータを生成する
     * @param sampleNum サンプル数
     * @return 作成pcmデータ
     */
    makeBeepBySampleNum(sampleNum: number): Int16Array;
    /**
     * 閉じる
     */
    close(): void;
}
