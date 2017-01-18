projects
--------------------

capture
--

here is how to record/render a scene to a movie file.

NOTE: this is not the optimal way to record - the resolution will be dependent on your current scene window size (use maximize on play or fullscreen). a better way is to use QuickTime (osx) or Fraps (win) and do a screenrecording.

* select 'Main Camera' in the Hierarchy window (or some other camera you want to record)
* select 'Add Component / New Script'
* call it something (here 'rec'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and save


```javascript
#pragma strict

var folder= "recFolder";
var frameRate= 30;
public var isRecording= false;
private var frameOffset= 0;

function Start () {
    Time.captureFramerate= frameRate;
    System.IO.Directory.CreateDirectory(folder);
}

function Update () {
    if(Input.GetKeyDown("r")) {	//use key R to start/stop recording
        isRecording= !isRecording;
        frameOffset= Time.frameCount;
    }
    if(isRecording) {
        var name= String.Format("{0}/img{1:D04}.png", folder, Time.frameCount-frameOffset);
        Application.CaptureScreenshot(name);
    }
}
```

now when you run your scene and press R the script will start capturing .png files to disk. the output recFolder will be found in your project folder. do not forget to empty it inbetween recordings.

to convert the png files to a mp4 movie there are many alternatives. one is to use ffmpeg in terminal...

```bash
ffmpeg -framerate 30 -i img%04d.png -s:v 1280x720 -c:v libx264 -profile:v high -crf 25 -pix_fmt yuv420p output.mp4
```
