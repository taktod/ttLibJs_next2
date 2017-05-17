// pitchを変換するプログラム
// ちゃんとしたものではなく機械通した声みたいになる。
// ちゃんとしたものが欲しいひとはsound-touchかそれを利用したプログラムを利用すればいいと思う。
// このプログラムはWebAudioのNodeとして動作します。
// 通常のpcmデータを変換したい場合はbufferPlayerかscriptPlayerをつかってnodeにデータを流しつつ、このshifterに流し。
// さらにそのデータをScriptProcessorあたりを利用して再取得してください。
"use strict";
exports.__esModule = true;
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
var PitchShifterNode = (function () {
    /**
     * コンストラクタ
     * @param context      動作対象audioContext
     * @param pitchRatio   pitchの変換パラメーター 1.0がそのまま数値があがるとpitchがあがります。
     * @param overlapRatio
     * @param grainSize
     */
    function PitchShifterNode(context, pitchRatio, overlapRatio, grainSize) {
        if (pitchRatio === void 0) { pitchRatio = 1.0; }
        if (overlapRatio === void 0) { overlapRatio = 0.5; }
        if (grainSize === void 0) { grainSize = 512; }
        var _this = this;
        this.pitchShifterProcessor = null;
        // 作成する動作
        switch (grainSize) {
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
        this.pitchShifterProcessor.onaudioprocess = function (event) {
            _this.onAudioProcess(event);
        };
    }
    PitchShifterNode.prototype.setPitchRatio = function (value) {
        this.pitchRatio = value;
        return true;
    };
    PitchShifterNode.prototype.setOverlapRatio = function (value) {
        this.overlapRatio = value;
        return true;
    };
    PitchShifterNode.prototype.refNode = function () {
        // 内部で利用しているnodeを参照する動作
        return this.pitchShifterProcessor;
    };
    PitchShifterNode.prototype.close = function () {
        // 閉じる動作
        if (this.pitchShifterProcessor) {
            this.pitchShifterProcessor.disconnect();
        }
    };
    PitchShifterNode.prototype.onAudioProcess = function (event) {
        var inputData = event.inputBuffer.getChannelData(0);
        var outputData = event.outputBuffer.getChannelData(0);
        for (var i = 0; i < inputData.length; ++i) {
            inputData[i] *= this.grainWindow[i];
            this.buffer[i] = this.buffer[i + this.grainSize];
            this.buffer[i + this.grainSize] = 0.0;
        }
        // Calculate the pitch shifted grain re-sampling and looping the input
        var grainData = new Float32Array(this.grainSize * 2);
        for (var i = 0, j = 0.0; i < this.grainSize; i++, j += this.pitchRatio) {
            var index = Math.floor(j) % this.grainSize;
            var a = inputData[index];
            var b = inputData[(index + 1) % this.grainSize];
            grainData[i] += this.linearInterpolation(a, b, j % 1.0) * this.grainWindow[i];
        }
        // Copy the grain multiple times overlapping it
        if (this.overlapRatio == 1) {
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
    };
    PitchShifterNode.prototype.hannWindow = function (length) {
        var window = new Float32Array(length);
        for (var i = 0; i < length; i++) {
            window[i] = 0.5 * (1 - Math.cos(2 * Math.PI * i / (length - 1)));
        }
        return window;
    };
    PitchShifterNode.prototype.linearInterpolation = function (a, b, t) {
        return a + (b - a) * t;
    };
    return PitchShifterNode;
}());
exports.PitchShifterNode = PitchShifterNode;
