export declare class MyAudioBuffer implements AudioBuffer {
    duration: number;
    length: number;
    numberOfChannels: number;
    sampleRate: number;
    private channelData;
    /**
     * コンストラクタ
     * @param buffer コピーする元ネタ
     */
    constructor(buffer: AudioBuffer);
    getChannelData(track: number): Float32Array;
    copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel?: number): void;
    copyToChannel(source: Float32Array, channelNumber: number, startInChannel?: number): void;
}
