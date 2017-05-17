import * as audioBeepGenerator from "./dist/audio/beepGenerator";
import * as audioBufferPlayer from "./dist/audio/BufferPlayer";
import * as audioScriptPlayer from "./dist/audio/ScriptPlayer";
import * as audioPitchShifterNode from "./dist/audio/PitchShifterNode";
import * as audioPitchShifterNode2 from "./dist/audio/PitchShifterNode2";
import * as videoSceneCapture from "./dist/video/sceneCapture";
import * as videoSceneDrawer from "./dist/video/sceneDrawer";
import * as videoVideoGl from "./dist/video/videoGl";
export declare namespace audio {
    var BeepGenerator: typeof audioBeepGenerator.BeepGenerator;
    var BufferPlayer: typeof audioBufferPlayer.BufferPlayer;
    var ScriptPlayer: typeof audioScriptPlayer.ScriptPlayer;
    var PitchShifterNode: typeof audioPitchShifterNode.PitchShifterNode;
    var PitchShifterNode2: typeof audioPitchShifterNode2.PitchShifterNode2;
}
export declare namespace video {
    var SceneCapture: typeof videoSceneCapture.SceneCapture;
    var SceneDrawer: typeof videoSceneDrawer.SceneDrawer;
    var VideoGl: typeof videoVideoGl.VideoGL;
}
