// こっちは比較的まともに動作するみたいです。
// こっちもWebAudioのNodeとして動作させます。
"use strict";
exports.__esModule = true;
var pitchShift = require("pitch-shift");
/**
 * 元となったプロジェクト
 * https://github.com/mikolalysenko/pitch-shift
 */
var PitchShifterNode2 = (function () {
    function PitchShifterNode2(context, pitchRatio, grainSize) {
        if (grainSize === void 0) { grainSize = 512; }
        var _this = this;
        this.queue = [];
        this.processWork = pitchShift(function (frame) {
            var copyFrame = new Float32Array(frame.length);
            copyFrame.set(frame, 0);
            _this.queue.push(copyFrame);
        }, function (t, pitch) {
            return pitchRatio;
        }, {
            frameSize: grainSize
        });
        this.node = context.createScriptProcessor(grainSize, 1, 1);
        this.node.onaudioprocess = function (event) {
            _this.onAudioProcess(event);
        };
    }
    PitchShifterNode2.prototype.refNode = function () {
        return this.node;
    };
    PitchShifterNode2.prototype.close = function () {
        this.node.disconnect();
    };
    PitchShifterNode2.prototype.onAudioProcess = function (event) {
        this.processWork(event.inputBuffer.getChannelData(0));
        var outputBuffer = event.outputBuffer.getChannelData(0);
        if (this.queue.length > 1) {
            outputBuffer.set(this.queue.shift(), 0);
        }
    };
    ;
    return PitchShifterNode2;
}());
exports.PitchShifterNode2 = PitchShifterNode2;
