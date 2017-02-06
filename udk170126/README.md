projects
--------------------

grid
--

using MaxMspJitter or Processing to take video input from webcamera, downsample it to 64x48 grascale and sending over osc to unity at 30fps.

NOTE: you can also access the webcamera directly in unity - this example is for a specific project and not the best solution in general.

* create a new 3d project in unity
* go to Edit / Project Settings / Player and tick 'Run In Background'
* go to https://github.com/heaversm/unity-osc-receiver and click the green download button
* get the .zip file and uncompress it
* find the folder Plugins in the zip you just uncompressed (unity-osc-receiver-master / Assets)
* drag&drop it into unity's assets window (bottom)
* select 'GameObject / Create Empty'
* in the inspector select 'Add Component / Scripts / Osc'
* and again select 'Add Component / Scripts / UDP Packet IO'
* select 'Add Component / New Script'
* call it something (here 'receiver'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and run

```javascript
#pragma strict

public var RemoteIP : String = "127.0.0.1";
public var SendToPort : int = 57120;	//unused
public var ListenerPort : int = 9876;
private var osc : Osc;
var width= 64;
var height= 48;
private var pixels : float[];
private var balls : GameObject[];
private var changed= false;

function Start() {
    var udp : UDPPacketIO = GetComponent("UDPPacketIO");
    udp.init(RemoteIP, SendToPort, ListenerPort);
    osc = GetComponent("Osc");
    osc.init(udp);
    osc.SetAllMessageHandler(AllMessageHandler);
    pixels= new float[width*height];
    balls= new GameObject[width*height];
    for(var i= 0; i<width*height; i++) {
        var ball= GameObject.CreatePrimitive(PrimitiveType.Sphere);
        var x= i%width;
        var y= i/width;
        ball.transform.localPosition= Vector3(x-(width/2), y-(height/2), 35);  //default value
        balls[i]= ball;
        pixels[i]= 35;	//default value
    }
}
function Update() {
    if(changed) {
        for(var i= 0; i<width*height; i++) {
            balls[i].transform.localPosition.z= pixels[i];
        }
        changed= false;
    }
}
public function AllMessageHandler(oscMessage: OscMessage) {
    var msgAddress = oscMessage.Address;
    var msgValue = oscMessage.Values;
    if(msgAddress=="/pixels") {
        var y : int = msgValue[0];	//first value is row index (0-47)
        for(var x= 0; x<width; x++) {
            pixels[y*width+x]= msgValue[x+1];
        }
        changed= true;
    }
}
```

you should see a grid of spheres. then download and start the max patch 'grid.maxpat' or the processing sketch 'grid.pde' that are available in the same git repository folder as this readme (scroll to the top of this page). run it and you should see something like in the screenshot below (which is showing my face and hand)...

![01grid](01grid.png?raw=true "grid")

NOTE: while writing this example i discovered that heaversm's osc plugins can not deal with messages longer than 198 values. if such a message arrives the plugin crashes and no more osc messages can be received until you leave play mode and press play again. so in this example we split up each video frame into rows and send 48 messages with 64 (actually 65) floats to get around this limitation.

mic trigger
--

the following example uses the microphone as a trigger.

* create a new project in unity
* select 'GameObject / 3D Object / Cube'
* select 'GameObject / Audio / Audio Source'
* select 'Add Component / New Script'
* call it something, make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and run

```javascript
#pragma strict

public var thresh= 0.3;
private var samples : float[];
private var snd : AudioSource;
public var cube : GameObject;

function Start() {
    snd= GetComponent.<AudioSource>();
    snd.clip= Microphone.Start(null, true, 1, 44100);
    snd.loop= true;
    while(!(Microphone.GetPosition(null)>0)) {}
    //snd.Play();   //monitor
    samples= new float[snd.clip.samples*snd.clip.channels];
    cube= GameObject.Find("Cube");
}
function Update() {
    var trigged= false;
    snd.clip.GetData(samples, 0);
    for(var i= 0; i<samples.Length; i++) {
        if(samples[i]>=thresh) {
            trigged= true;
            break;
        }
    }
    //--check the trigger and do something - here just move a cube
    if(trigged) {
        cube.transform.localPosition.y= 2;
    } else {
        cube.transform.localPosition.y= 0;
    }
}
```
now tap on the microphone and you should see the cube jump up if the amplitude is above the threshold (0.3 by default).

camera
--

this example sets up a script that make the main camera follow and spin around the head of a character.

* create a new 3d project in unity
* select 'GameObject / 3D Object / Terrain'
* select 'Assets / Import Package / Characters'
* click 'import' in the window that pops up to import everything
* go to 'Project' tab and then expand Assets
* find 'Standard Assets / Characters / ThirdPersonCharacter / Prefabs / ThirdPersonController'
* drag&drop ThirdPersonController into the Hierarchy window
* set the position to x:1, y:0, z:1 so that the character is starting over the terrain
* select 'Add Component / New Script'
* call it something, make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and run

```javascript
#pragma strict

public var cameras : GameObject[];
public var radius= 1;
public var height= 2;
public var speed= 0.02;

function Start() {
    cameras= GameObject.FindGameObjectsWithTag("MainCamera");
}
function Update() {
    var x= Mathf.Sin(Time.frameCount*speed)*radius;
    var z= Mathf.Cos(Time.frameCount*speed)*radius;
    cameras[0].transform.localPosition= this.transform.position+Vector3(x, height, z);
    cameras[0].transform.LookAt(this.transform);
}
```

now try changing radius, height and speed (can also go negative) while the scene is running.

NOTE: the arrow keys will not work correctly. they should be independent of camera rotation but are not.

fft terrain
--

in this example we take the spectrum of the microphone input and turn it into a realtime terrain heightmap.

* create a new 3d project in unity
* select 'GameObject / 3D Object / Terrain'
* select 'Assets / Import Package / Characters'
* click 'import' in the window that pops up to import everything
* go to 'Project' tab and then expand Assets
* find 'Standard Assets / Characters / FirstPersonCharacter / Prefabs / FPSController'
* drag&drop FPSController into the Hierarchy window
* set the position to x:1, y:0, z:1 so that the character is starting over the terrain
* mute the Audio Listener in for Main Camera in the inspector window
* select 'GameObject / Audio / Audio Source'
* select 'Add Component / New Script'
* call it something (here fft), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and run

```javascript
#pragma strict

private var spectrum : float[];
private var snd : AudioSource;
private var buffersize= 256;    //fft buffer size in samples (must be power-of-two)
public var amp= 0.1;
public var speed= 0.2;
private var terrain : Terrain;
private var heightData : TerrainData;
private var width : int;
private var height : int;
private var heights : float[,];

function Start() {
    snd= GetComponent.<AudioSource>();
    snd.clip= Microphone.Start(null, true, 1, 44100);
    snd.loop= true;
    while(!(Microphone.GetPosition(null)>0)) {}
    snd.Play();   //must be playing for GetSpectrumData to work
    spectrum= new float[buffersize];
    terrain= GameObject.Find("Terrain").transform.GetComponent(Terrain);
    heightData= terrain.terrainData;
    heightData.heightmapResolution= buffersize+1;
    width= heightData.heightmapWidth;
    height= heightData.heightmapHeight;
    heights= heightData.GetHeights(0, 0, width, 1);
}
function Update() {
    var y : int = (Time.frameCount*speed)%width;
    snd.GetSpectrumData(spectrum, 0, FFTWindow.Hanning);
    for(var x= 0; x<buffersize; x++) {
        var val= spectrum[x]*amp;
        heights[0, x]= val;
        //heights[0, Mathf.Log(x+1, buffersize)*buffersize]= val;  //linear mapping
    }
    heightData.SetHeights(0, y, heights);
}
```

tap the microphone and run around. you should see the spectrum of the sound as dynamically updated mountains. if your computer can handle it try to increase the resolution (buffersize) to 512 or even 1024 to see more details.

![02fft](02fft.png?raw=true "fft")

references
--

<https://unity3d.com/learn/tutorials/topics/graphics/terrain-introduction-heightmaps>
