"use strict";
exports.__esModule = true;
var myAudioBuffer_1 = require("./myAudioBuffer");
var ScriptPlayer = (function () {
    /**
     * コンストラクタ
     * @param context 動作対象AudioContext
     * @param channelNum 動作チャンネル数 1:モノラル 2:ステレオ
     */
    function ScriptPlayer(context, channelNum) {
        var _this = this;
        this.processorNode = context.createScriptProcessor(1024, // iOSの場合はここにデータを設置しないとエラーになった。iOS8での話
        channelNum, channelNum);
        this.processorNode.onaudioprocess = function (ev) {
            _this._onaudioprocess(ev);
        };
        this.isStart = false;
        this.holdAudioBuffers = null;
        this.holdPcm16Buffers = [];
        this.totalHoldSampleNum = 0;
        this.channelNum = channelNum;
        this.usingAudioBuffer = null;
        this.usingPcm16Buffer = null;
        this.usingBufferPos = 0;
    }
    /**
     * AudioNode参照
     * @return AudioNode
     */
    ScriptPlayer.prototype.refNode = function () {
        return this.processorNode;
    };
    /**
     * bufferを再生queueにいれる。
     * @param buffer 再生させたいaudioBuffer
     * @param nonCopyMode trueなら入力bufferをそのまま使う falseならデータをコピーして使う。
     */
    ScriptPlayer.prototype.queueBufer = function (buffer, nonCopyMode) {
        if (this.processorNode == null) {
            return;
        }
        if (buffer.numberOfChannels != this.channelNum) {
            console.log("channel数がかわったbufferが追加されています。");
            return;
        }
        if (this.holdAudioBuffers == null) {
            this.holdAudioBuffers = [];
            this.holdPcm16Buffers = null;
            this.totalHoldSampleNum = 0;
            this.usingAudioBuffer = null;
            this.usingPcm16Buffer = null;
            this.usingBufferPos = 0;
        }
        this.totalHoldSampleNum += buffer.getChannelData(0).length;
        if (nonCopyMode) {
            this.holdAudioBuffers.push(buffer);
        }
        else {
            // bufferのコピーをつくるわけだが、bufferはコピーできないので、Float32Arrayを保持するbufferをつくろうと思う。
            this.holdAudioBuffers.push(new myAudioBuffer_1.MyAudioBuffer(buffer));
        }
    };
    /**
     * int16Arrayのpcmを再生queueにいれる。
     * @param pcm         pcmデータ
     * @param nonCopyMode データをコピーするかどうかフラグ
     */
    ScriptPlayer.prototype.queueInt16Array = function (pcm, nonCopyMode) {
        // ここで追加されている
        if (this.processorNode == null) {
            return;
        }
        if (this.holdPcm16Buffers == null) {
            this.holdAudioBuffers = null;
            this.holdPcm16Buffers = [];
            this.totalHoldSampleNum = 0;
            this.usingAudioBuffer = null;
            this.usingPcm16Buffer = null;
            this.usingBufferPos = 0;
        }
        this.totalHoldSampleNum += pcm.length / this.channelNum;
        if (nonCopyMode) {
            this.holdPcm16Buffers.push(pcm);
        }
        else {
            this.holdPcm16Buffers.push(new Int16Array(pcm));
        }
    };
    ScriptPlayer.prototype._onaudioprocess = function (ev) {
        if (this.isStart || this.holdPcm16Buffers.length > 50) {
            this.isStart = true;
            var outputBuffer = ev.outputBuffer;
            if (outputBuffer.getChannelData(0).length > this.totalHoldSampleNum) {
                // ここ、コピーしておかないと、よくわからない音がでる懸念がある
                // 基本ラストデータのゴミがはいっている。
                for (var i = 0; i < outputBuffer.numberOfChannels; ++i) {
                    var ary = outputBuffer.getChannelData(i);
                    ary.set(new Float32Array(ary.length));
                }
                return;
            }
            if (this.holdAudioBuffers != null) {
                this._onBufferProcess(outputBuffer);
            }
            else if (this.holdPcm16Buffers != null) {
                this._onPcm16Process(outputBuffer);
            }
        }
    };
    ScriptPlayer.prototype._onBufferProcess = function (outputBuffer) {
        var targetPos = 0;
        do {
            if (this.usingAudioBuffer == null) {
                this.usingAudioBuffer = this.holdAudioBuffers.shift();
                this.usingBufferPos = 0;
                if (this.usingAudioBuffer == null) {
                    return;
                }
            }
            var targetSize = outputBuffer.getChannelData(0).length - targetPos;
            var holdSize = this.usingAudioBuffer.getChannelData(0).length - this.usingBufferPos;
            var appendSize = (targetSize < holdSize) ? targetSize : holdSize;
            // 利用するbufferにはいっているデータとoutputBufferに書き込み実施すべきデータ量を比較する必要がある。
            // データをコピーしていく。
            for (var i = 0; i < outputBuffer.numberOfChannels; ++i) {
                var destAry = outputBuffer.getChannelData(i);
                var srcAry = this.usingAudioBuffer.getChannelData(i);
                destAry.set(srcAry.subarray(this.usingBufferPos, this.usingBufferPos + appendSize), targetPos);
            }
            // コピーおわったらフラグを移動する。
            this.usingBufferPos += appendSize;
            targetPos += appendSize;
            this.totalHoldSampleNum -= appendSize;
            if (this.usingBufferPos == this.usingAudioBuffer.getChannelData(0).length) {
                // usingBufferの中身を利用しおわった。
                this.usingAudioBuffer = null;
            }
        } while (targetPos < outputBuffer.getChannelData(0).length);
    };
    ScriptPlayer.prototype._onPcm16Process = function (outputBuffer) {
        var targetPos = 0;
        do {
            if (this.usingPcm16Buffer == null) {
                this.usingPcm16Buffer = this.holdPcm16Buffers.shift();
                this.usingBufferPos = 0;
                if (this.usingPcm16Buffer == null) {
                    return;
                }
            }
            var targetSize = outputBuffer.getChannelData(0).length - targetPos;
            var holdSize = this.usingPcm16Buffer.length / this.channelNum - this.usingBufferPos;
            var appendSize = (targetSize < holdSize) ? targetSize : holdSize;
            // 利用するbufferにはいっているデータとoutputBufferに書き込み実施すべきデータ量を比較する必要がある。
            // データをコピーしていく。
            for (var i = 0; i < outputBuffer.numberOfChannels; ++i) {
                var destAry = outputBuffer.getChannelData(i);
                var srcAry = this.usingPcm16Buffer;
                // usingBufferPos以降にあるデータをappendSize分コピーする。
                // コピー先はtargetPosから導き出す。
                for (var j = 0; j < appendSize; ++j) {
                    destAry[targetPos + j] = srcAry[this.channelNum * (this.usingBufferPos + j) + i] / 32767;
                }
            }
            // コピーおわったらフラグを移動する。
            this.usingBufferPos += appendSize;
            targetPos += appendSize;
            this.totalHoldSampleNum -= appendSize;
            if (this.usingBufferPos == this.usingPcm16Buffer.length / this.channelNum) {
                // usingBufferの中身を利用しおわった。
                this.usingPcm16Buffer = null;
            }
        } while (targetPos < outputBuffer.getChannelData(0).length);
    };
    /**
     * 後始末
     */
    ScriptPlayer.prototype.close = function () {
        // 終了処理
        // とりあえずdisconnectしとく。
        this.processorNode.disconnect();
        this.processorNode = null;
    };
    return ScriptPlayer;
}());
exports.ScriptPlayer = ScriptPlayer;
