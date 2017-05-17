// pitchを変換するプログラム
// ちゃんとしたものではなく機械通した声みたいになる。
// ちゃんとしたものが欲しいひとはsound-touchかそれを利用したプログラムを利用すればいいと思う。
// このプログラムはWebAudioのNodeとして動作します。
// 通常のpcmデータを変換したい場合はbufferPlayerかscriptPlayerをつかってnodeにデータを流しつつ、このshifterに流し。
// さらにそのデータをScriptProcessorあたりを利用して再取得してください。

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
export class PitchShifterNode {
  private pitchShifterProcessor:ScriptProcessorNode = null;
  private grainSize:number;
  private pitchRatio:number;
  private overlapRatio:number;

  private buffer:Float32Array;
  private grainWindow:Float32Array;
  /**
   * コンストラクタ
   * @param context      動作対象audioContext
   * @param pitchRatio   pitchの変換パラメーター 1.0がそのまま数値があがるとpitchがあがります。
   * @param overlapRatio
   * @param grainSize
   */
  constructor(
      context:AudioContext,
      pitchRatio:number = 1.0,
      overlapRatio:number = 0.5,
      grainSize:number = 512) {
    // 作成する動作
    switch(grainSize) {
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
        break;
      default:
        throw new Error("grainSizeは256の倍数である必要があります。");
    }
    this.grainSize = grainSize;
    this.pitchRatio = pitchRatio;
    this.overlapRatio = overlapRatio;
    // ここでprocessorを作成しておく。
    // とりあえず利用できるのはモノラルだけに限っておく。
    this.pitchShifterProcessor = context.createScriptProcessor(grainSize, 1, 1);
    this.buffer = new Float32Array(grainSize * 2);
    this.grainWindow = this.hannWindow(grainSize);
    this.pitchShifterProcessor.onaudioprocess = (event:AudioProcessingEvent) => {
      this.onAudioProcess(event);
    };
  }
  public setPitchRatio(value:number):boolean {
    this.pitchRatio = value;
    return true;
  }
  public setOverlapRatio(value:number):boolean {
    this.overlapRatio = value;
    return true;
  }
  public refNode():AudioNode {
    // 内部で利用しているnodeを参照する動作
    return this.pitchShifterProcessor;
  }
  public close():void {
    // 閉じる動作
    if(this.pitchShifterProcessor) {
      this.pitchShifterProcessor.disconnect();
    }
  }
  private onAudioProcess(event:AudioProcessingEvent) {
    var inputData:Float32Array = event.inputBuffer.getChannelData(0);
    var outputData:Float32Array = event.outputBuffer.getChannelData(0);

    for(var i = 0;i < inputData.length;++ i) {
      inputData[i] *= this.grainWindow[i];

      this.buffer[i] = this.buffer[i + this.grainSize];
      this.buffer[i + this.grainSize] = 0.0;
    }
            // Calculate the pitch shifted grain re-sampling and looping the input
            var grainData = new Float32Array(this.grainSize * 2);
            for (var i = 0, j = 0.0;
                 i < this.grainSize;
                 i++, j += this.pitchRatio) {

                var index = Math.floor(j) % this.grainSize;
                var a = inputData[index];
                var b = inputData[(index + 1) % this.grainSize];
                grainData[i] += this.linearInterpolation(a, b, j % 1.0) * this.grainWindow[i];
            }

            // Copy the grain multiple times overlapping it
            if(this.overlapRatio == 1) {
                for (j = 0; j <= this.grainSize; j++) {
                    this.buffer[j] += grainData[j];
                }
            }
            else {
              for (i = 0; i < this.grainSize; i += Math.round(this.grainSize * (1 - this.overlapRatio))) {
                  for (j = 0; j <= this.grainSize; j++) {
                      this.buffer[i + j] += grainData[j];
                  }
              }
            }

            // Output the first half of the buffer
            for (i = 0; i < this.grainSize; i++) {
                outputData[i] = this.buffer[i];
            }
  }
  private hannWindow(length:number):Float32Array {
    var window = new Float32Array(length);
    for(var i = 0;i < length;i ++) {
      window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (length - 1)));
    }
    return window;
  }
  private linearInterpolation(a:number, b:number, t:number):number {
    return a + (b - a) * t;
  }
}
