"use strict";
exports.__esModule = true;
var BeepGenerator = (function () {
    /**
     * コンストラクタ
     * @param targetHz   再生音の周波数 440がラの音
     * @param sampleRate 動作サンプルレート
     * @param channelNum 動作チャンネル数 1:モノラル 2:ステレオ
     */
    function BeepGenerator(targetHz, sampleRate, channelNum) {
        this.targetHz = targetHz;
        this.sampleRate = sampleRate;
        this.channelNum = channelNum;
        this.pos = 0;
    }
    /**
     * 指定ミリ秒のデータを生成する。
     * @param duration ミリ秒
     * @return 作成pcmデータ
     */
    BeepGenerator.prototype.makeBeepByMilisec = function (duration) {
        // サンプル数を計算して、処理する。
        var targetSampleNum = Math.floor(duration * this.sampleRate / 1000);
        return this.makeBeepBySampleNum(targetSampleNum);
    };
    /**
     * 指定サンプル数のデータを生成する
     * @param sampleNum サンプル数
     * @return 作成pcmデータ
     */
    BeepGenerator.prototype.makeBeepBySampleNum = function (sampleNum) {
        if (this.amplitude > 32767) {
            this.amplitude = 32767;
        }
        else if (this.amplitude < -32767) {
            this.amplitude = -32767;
        }
        var pcm = new Int16Array(sampleNum * this.channelNum);
        for (var i = 0; i < sampleNum; ++i) {
            var data = Math.sin((i + this.pos) * 3.141592654 * 2 * this.targetHz / this.sampleRate) * 32767;
            for (var j = 0; j < this.channelNum; ++j) {
                pcm[this.channelNum * i + j] = data;
            }
        }
        this.pos += sampleNum;
        return pcm;
    };
    /**
     * 閉じる
     */
    BeepGenerator.prototype.close = function () {
        // 終了処理
    };
    return BeepGenerator;
}());
exports.BeepGenerator = BeepGenerator;
