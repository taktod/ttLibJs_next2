"use strict";
exports.__esModule = true;
var MyAudioBuffer = (function () {
    /**
     * コンストラクタ
     * @param buffer コピーする元ネタ
     */
    function MyAudioBuffer(buffer) {
        this.duration = buffer.duration;
        this.length = buffer.length;
        this.numberOfChannels = buffer.numberOfChannels;
        this.sampleRate = buffer.sampleRate;
        this.channelData = [];
        for (var i = 0; i < this.numberOfChannels; ++i) {
            this.channelData[i] = new Float32Array(buffer.getChannelData(i));
        }
    }
    MyAudioBuffer.prototype.getChannelData = function (track) {
        return this.channelData[track];
    };
    MyAudioBuffer.prototype.copyFromChannel = function (destination, channelNumber, startInChannel) {
        throw new Error("copyFromChannel is not implemented.");
    };
    MyAudioBuffer.prototype.copyToChannel = function (source, channelNumber, startInChannel) {
        throw new Error("copyToChannel is not implemented.");
    };
    return MyAudioBuffer;
}());
exports.MyAudioBuffer = MyAudioBuffer;
