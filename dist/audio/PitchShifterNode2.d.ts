/**
 * 元となったプロジェクト
 * https://github.com/mikolalysenko/pitch-shift
 */
export declare class PitchShifterNode2 {
    private queue;
    private processWork;
    private node;
    constructor(context: AudioContext, pitchRatio: number, grainSize?: number);
    refNode(): AudioNode;
    close(): void;
    private onAudioProcess(event);
}
