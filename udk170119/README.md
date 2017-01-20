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

NOTE: for the above line to work you will need to have ffmpeg installed (easy with homebrew on osx)

animation
--

* select 'Main Camera' in the Hierarchy window
* select 'Window / Animation' to open the animation window
* click the 'Create' button and enter a name for your animation
* click the 'Add Propery' button and select 'Transform / Position'
* select the 'Curves' tab near the bottom of the window and start drawing some curves
* ctrl+click to add new keys, space key to play
* in the 'Samples' numberbox you can control the speed

![01animation](01animation.png?raw=true "animation")

note that any object and parameter can be animated - not only the main camera

movie
--

simple example with one plane acting as a video screen...

* create a new 3d project
* create a folder (left or control click in the assets window) and name it 'Resources'
* drag&drop a movie file into it (here transit.mov). NOTE edit the code below to match this name
* select 'GameObject / 3D Object / Plane'
* select 'Add Component / New Script'
* call it something (here 'movie'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and save

```javascript
#pragma strict

public var texture : MovieTexture;

function Start() {
    texture= Resources.Load("transit"); //edit to match your filename
    this.GetComponent.<Renderer>().material.mainTexture= texture;
    texture.loop= true;
    texture.Play();
}

function Update() {
}
```

press play in unity and you should see something like this...

![02movie](02movie.png?raw=true "movie")

movies
--

this example generates a lot of (100) plane objects and map videos as textures.

* create a new 3d project
* create a folder (left or control click in the assets window) and name it 'Resources'
* drag&drop a few movie files into it (here station.mov, street.mov, transit.mov)
* select 'GameObject / Create Empty'
* select 'Add Component / New Script'
* call it something (here 'dna'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and save

```javascript
#pragma strict

public var freq= 0.3;
public var depthFactor= 0.6;
public var amp= 5;	//spiral radius
public var size= 0.1;

function Start() {
    var num= 100;	//how many plane objects
    var textures= [	//movie files to load...
        Resources.Load("yetanotherdemo") as MovieTexture,
        Resources.Load("street") as MovieTexture
    ];
    for(var j= 0; j<2; j++) {
        for(var i= 0; i<num; i++) {	//double spiral
            var plane= GameObject.CreatePrimitive(PrimitiveType.Plane);
            plane.transform.localScale= Vector3(size, size, 0-size);
            var offset= j*Mathf.PI;
            plane.transform.localPosition= Vector3(Mathf.Sin(i*freq+offset)*amp, Mathf.Cos(i*freq+offset)*amp, i*depthFactor);
            plane.transform.localRotation.x= -1;	//flip planes 90degrees facing the camera
            plane.GetComponent.<Renderer>().materials[0].mainTexture= textures[(j+i)%textures.length];
        }
    }
    for(var tex in textures) {
        tex.loop= true;
        tex.Play();
    }
    this.transform.localPosition= Vector3(0, 0, 0);
}

function Update() {
}
```

test it by pressing play. you should see many planes in a double spiral.

NOTE: you will need to edit the code to match the filenames you use.

now add a character that can move around and come close to the movies

* select 'Assets / Import Package / Characters'
* click 'import' in the window that pops up to import everything
* go to 'Project' tab and then expand Assets
* find 'Standard Assets / Characters / FirstPersonCharacter / Prefabs / FPSController'
* drag&drop FPSController into the Hierarchy window
* drag&drop the 'Main Camera' onto the 'FPSController' in the Hierarchy window
* mute the Audio Listener in for Main Camera in the inspector window
* select 'Edit / Project Settings / Physics' and set Y gravity to 0 (the default is -9.81)
* press play and you should see something like this (and move around with the arrow keys)...

![03spiral](03spiral.png?raw=true "spiral")

sonogram
--

NOTE: make sure you have the microphone selected as audio input device and use headphones to avoid feedback.

* create a new 3d project
* select 'GameObject / 3D Object / Plane'
* position the 'Main Camera' at x:0 y:9 z:0 with rotation x:90 y:0 z:0
* select 'GameObject / Audio / Audio Source'
* select 'Add Component / New Script'
* call it something (here 'sono'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and save

```javascript
#pragma strict

private var spectrum : float[];
private var snd : AudioSource;
private var buffersize= 512;    //fft buffer size in samples (must be power-of-two)
public var resolution= 100;		//0-255
public var amp= 4.0;
public var plane : GameObject;
public var texture: Texture2D;

function Start() {
    snd= GetComponent.<AudioSource>();
    snd.clip= Microphone.Start(null, true, 1, 44100);
    snd.loop= true;
    while(!(Microphone.GetPosition(null)>0)) {}
    snd.Play();   //must be playing for GetSpectrumData to work
    spectrum= new float[buffersize];
    plane= GameObject.Find("Plane");
    texture= new Texture2D(256, buffersize);	//max resolution
    plane.GetComponent.<Renderer>().material.mainTexture= texture;
}
function Update() {
    snd.GetSpectrumData(spectrum, 0, FFTWindow.Hanning);
    var columns= Mathf.Clamp(resolution, 1, texture.width);
    var columnWidth= texture.width/columns;
    var offset= columnWidth*(Time.frameCount%columns);
    for(var y= 0; y<buffersize; y++) {
        var val= spectrum[y]*amp;
        var color: Color= Color(0, val, 0);
        for(var x= 0; x<columnWidth; x++) {
            texture.SetPixel(offset+x, y, color);
        }
    }
    texture.Apply();
}
```

now when you run this scene should see a sonogram forming - tap on the microphone. play around with the amp and resolution variables in AudioSource.

![04sonogram](04sonogram.png?raw=true "sonogram")
