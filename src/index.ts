import * as audioBeepGenerator     from "./dist/audio/beepGenerator";
import * as audioBufferPlayer      from "./dist/audio/BufferPlayer";
import * as audioScriptPlayer      from "./dist/audio/ScriptPlayer";
import * as audioPitchShifterNode  from "./dist/audio/PitchShifterNode";
import * as audioPitchShifterNode2 from "./dist/audio/PitchShifterNode2";

import * as videoSceneCapture from "./dist/video/sceneCapture";
import * as videoSceneDrawer from "./dist/video/sceneDrawer";
import * as videoVideoGl from "./dist/video/videoGl";

export namespace audio {
  export var BeepGenerator     = audioBeepGenerator.BeepGenerator;
  export var BufferPlayer      = audioBufferPlayer.BufferPlayer;
  export var ScriptPlayer      = audioScriptPlayer.ScriptPlayer;
  export var PitchShifterNode  = audioPitchShifterNode.PitchShifterNode;
  export var PitchShifterNode2 = audioPitchShifterNode2.PitchShifterNode2;
}

export namespace video {
  export var SceneCapture = videoSceneCapture.SceneCapture;
  export var SceneDrawer  = videoSceneDrawer.SceneDrawer;
  export var VideoGl      = videoVideoGl.VideoGL;
}
