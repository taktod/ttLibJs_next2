// こっちは比較的まともに動作するみたいです。
// こっちもWebAudioのNodeとして動作させます。

import * as pitchShift from "pitch-shift";

/**
 * 元となったプロジェクト
 * https://github.com/mikolalysenko/pitch-shift
 */
export class PitchShifterNode2 {
  private queue:Array<Float32Array>;
  private processWork:Function;
  private node:ScriptProcessorNode;
  constructor(
      context:AudioContext,
      pitchRatio:number,
      grainSize:number = 512) {
    this.queue = [];
    this.processWork = pitchShift(
      (frame:Float32Array) => {
        var copyFrame:Float32Array = new Float32Array(frame.length)
        copyFrame.set(frame, 0);
        this.queue.push(copyFrame);
      },
      (t, pitch) => {
        return pitchRatio;
      },
      {
        frameSize: grainSize
      }
    );
    this.node = context.createScriptProcessor(grainSize, 1, 1);
    this.node.onaudioprocess = (event:AudioProcessingEvent) => {
      this.onAudioProcess(event);
    }
  }
  public refNode():AudioNode {
    return this.node;
  }
  public close():void {
    this.node.disconnect();
  }
  private onAudioProcess(event:AudioProcessingEvent) {
    this.processWork(event.inputBuffer.getChannelData(0));
    var outputBuffer = event.outputBuffer.getChannelData(0);
    if(this.queue.length > 1) {
      outputBuffer.set(this.queue.shift(), 0);
    }
  };
}