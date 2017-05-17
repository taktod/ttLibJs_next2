export class MyAudioBuffer implements AudioBuffer {
  duration:number;
  length:number;
  numberOfChannels:number;
  sampleRate:number;
  private channelData:Array<Float32Array>
  /**
   * コンストラクタ
   * @param buffer コピーする元ネタ
   */
  constructor(buffer:AudioBuffer) {
    this.duration = buffer.duration;
    this.length = buffer.length;
    this.numberOfChannels = buffer.numberOfChannels;
    this.sampleRate = buffer.sampleRate;
    this.channelData = [];
    for(var i = 0;i < this.numberOfChannels;++ i) {
      this.channelData[i] = new Float32Array(buffer.getChannelData(i));
    }
  }
  public getChannelData(track:number):Float32Array {
    return this.channelData[track];
  }
  public copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel?: number): void {
    throw new Error("copyFromChannel is not implemented.");
  }
  public copyToChannel(source: Float32Array, channelNumber: number, startInChannel?: number): void {
    throw new Error("copyToChannel is not implemented.");
  }
}