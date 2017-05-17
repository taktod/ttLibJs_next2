"use strict";
exports.__esModule = true;
var audioBeepGenerator = require("./dist/audio/beepGenerator");
var audioBufferPlayer = require("./dist/audio/BufferPlayer");
var audioScriptPlayer = require("./dist/audio/ScriptPlayer");
var audioPitchShifterNode = require("./dist/audio/PitchShifterNode");
var audioPitchShifterNode2 = require("./dist/audio/PitchShifterNode2");
var videoSceneCapture = require("./dist/video/sceneCapture");
var videoSceneDrawer = require("./dist/video/sceneDrawer");
var videoVideoGl = require("./dist/video/videoGl");
var audio;
(function (audio) {
    audio.BeepGenerator = audioBeepGenerator.BeepGenerator;
    audio.BufferPlayer = audioBufferPlayer.BufferPlayer;
    audio.ScriptPlayer = audioScriptPlayer.ScriptPlayer;
    audio.PitchShifterNode = audioPitchShifterNode.PitchShifterNode;
    audio.PitchShifterNode2 = audioPitchShifterNode2.PitchShifterNode2;
})(audio = exports.audio || (exports.audio = {}));
var video;
(function (video) {
    video.SceneCapture = videoSceneCapture.SceneCapture;
    video.SceneDrawer = videoSceneDrawer.SceneDrawer;
    video.VideoGl = videoVideoGl.VideoGL;
})(video = exports.video || (exports.video = {}));
