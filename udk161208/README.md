more network
--------------------

this time we will send osc from unity to supercollider.

supercollider
--

first we just load some soundfiles and play them locallly (on our own machines)

remember you can drag&drop files from desktop on to the supercollider code document to get the path names.

```
s.boot;

//load some soundfiles into buffers
a= Buffer.readChannel(s, "/Users/asdf/Desktop/ND_BeatMixA125-01.wav", channels: [0]);
b= Buffer.readChannel(s, "/Users/asdf/Desktop/ND_EnvGuitar_125_A-01.wav", channels: [0]);
c= Buffer.readChannel(s, "/Users/asdf/Desktop/ND_BreakC125-01.wav", channels: [0]);

//test so that the buffers loaded
a.play;
b.play;
c.play;

//set up an osc listener
(
OSCdef(\sfplayer, {|msg|
    var index= msg[1];
    msg.postln;
    {PlayBuf.ar(1, [a, b, c].wrapAt(index), doneAction:2)}.play;
}, \sfplay);
)

//test by sending osc to yourself
n= NetAddr("127.0.0.1", 57120);
n.sendMsg(\sfplay, 0);
n.sendMsg(\sfplay, 1);
n.sendMsg(\sfplay, 2);
```

now try to play soundfiles remotely (on your neighbour's machine)

```
//send to your neighbours
m= NetAddr("192.168.1.52", 57120);  //edit ip to match some neighbour
m.sendMsg(\sfplay, 3.rand);
p= NetAddr("192.168.1.53", 57120);  //edit ip to match some neighbour
p.sendMsg(\sfplay, 3.rand);
//etc
```

this only works if we are all on the same network and all have the oscdef listener with three soundfiles loaded.

unity
--

set up a terrain + first person character

* start unity and create a new project
* select GameObject / 3D Object / Terrain
* select Assets / Import Package / Characters
* just click 'import' in the window that pops up to import everything
* go to 'Project' tab and then expand Assets
* find Standard Assets / Characters / FirstPersonCharacter / Prefabs / FPSController
* drag&drop FPSController onto the terrain
* go to Edit / Project Settings / Player and tick 'Run In Background'

set up osc

* go to https://github.com/heaversm/unity-osc-receiver and click the green download button
* get the .zip file and uncompress it
* find the folder Plugins in the zip you just uncompressed (unity-osc-receiver-master / Assets)
* drag&drop it into unity's assets window (bottom)
* select GameObject / Create Empty
* in the inspector select 'Add Component / Scripts / Osc'
* and again select 'Add Component / Scripts / UDP Packet IO'
* your scene should now look like this...

![01init](01init.png?raw=true "init")

now let us create a custom sender script.

* make sure the GameObject is selected in Hierarchy window like before
* in the inspector select 'Add Component / New Script'
* call it something (here 'sender'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the following code replacing what was there...

```javascript
//this code is a template for sending osc - edit to match your scene
#pragma strict

public var RemoteIP : String = "127.0.0.1";
public var SendToPort : int = 57120;
public var ListenerPort : int = 8400;
private var osc : Osc;

function Start () {
    var udp : UDPPacketIO = GetComponent("UDPPacketIO");
    udp.init(RemoteIP, SendToPort, ListenerPort);
    osc = GetComponent("Osc");
    osc.init(udp);
}

function Update () {
    var fps= GameObject.Find("FPSController");
    var x : float = fps.transform.position.x;
    var y : float = fps.transform.position.y;
    var z : float = fps.transform.position.z;
    //here could optimize to only send when character is moving
    var msg : OscMessage;
    msg= Osc.StringToOscMessage("/fps "+x+" "+y+" "+z);
    osc.Send(msg);
}

function OnDisable() {
    osc.Cancel();
    osc = null;
}
```

now open supercollider and run the following code

```
//supercollider code:
OSCFunc.trace(true, true);  //turn on debugging
```

go back to unity, click play and then run around with the arrow keys (space to jump, shift to run)
if everything works you should see data being printed in supercollider's post window.

```
OSC Message Received:
    time: 5783.893580814
    address: a NetAddr(127.0.0.1, 60512)
    recvPort: 57120
    msg: [ /fps, 3.4811170101166, 0.90986347198486, -0.25537699460983 ]

OSC Message Received:
    time: 5783.91009708
    address: a NetAddr(127.0.0.1, 60512)
    recvPort: 57120
    msg: [ /fps, 3.4811170101166, 0.90986347198486, -0.25537699460983 ]

OSC Message Received:
    time: 5783.926821937
    address: a NetAddr(127.0.0.1, 60512)
    recvPort: 57120
    msg: [ /fps, 3.4811170101166, 0.90986347198486, -0.25537699460983 ]
```

to make sound run the following code in supercollider...

```
//use with example script 'sender'
(
var syn= {|freq1= 100, freq2= 100, mul= 0|
    VarSaw.ar([freq1, freq2]*mul.lag);
}.play;
OSCdef(\fps, {|msg|
    var x= msg[1];
    var y= msg[2];
    var z= msg[3];
    [x, y, z].postln;  //debug
    syn.set(\freq1, x, \mul, y.clip(0, 100), \freq2, z);
    //syn.set(\freq1, x.linexp(-100, 100, 100, 1000), \mul, y.clip(0, 100), \freq2, z.linexp(-100, 100, 100, 1000));  //another way showing how to map to certain ranges
}, \fps);
)
```

now run far out on the terrain to turn up the frequencies in left and right channel. jump to make the frequency go up/down quickly.

then go back to supercollider and run the following code. it requires a soundfile (aiff or wav) and by moving around in the terrain you also control trigger rate and offset position of the soundfile granulator (TGrains).

```
b.free; b= Buffer.readChannel(s, "/Users/asdf/Desktop/ND_BeatMixA125-01.wav", channels: [0]);

(
var syn= {|rate= 0, offset= 0, dur= 0.1|
    var amp= (Mix(HPZ1.kr([rate, offset, dur]))>0.01).lagud(0.001, 10);
    //amp= 1;  //uncomment this line if you want it to play all the time
    TGrains.ar(2, Impulse.ar(rate), b.bufnum, 1, offset%b.duration, dur)*amp;
}.play;
OSCdef(\fps, {|msg|
    var x= msg[1];
    var y= msg[2];
    var z= msg[3];
    [x, y, z].postln;  //debug
    syn.set(\rate, x, \dur, y.linlin(0.98, 4, 0.05, 1), \offset, z);
}, \fps);
)
```

terrain
--

let's make the world a bit more interesting by adding a texture and some heights to the terrain. this way you can more easily remember locations that sound good!

* take a still picture (png or jpg) and drag&drop it onto the Assets
* select Terrain in the Hierarchy
* find 'Paint Texture' under the brush icon tab in the Inspector
* click Edit Textures and then Add Texture
* drag&drop the picture you just imported to the select areas that pop up and click add

![02texture](02texture.png?raw=true "texture")

* then find 'Rasise / Lower Terrain' under the mountain icon tab
* click on the terrain to add height, shift+click to remove height
* your scene should look something like this...

![03terrain](03terrain.png?raw=true "terrain")

NOTE: you might need to move up the FPSController's initial position so that it doesn't fall through the terrain to begin with (just increase Y position under Transform).

play around with texture mapping, terrain heights, fpscontroller run and jump speed, load different soundfiles and pictures etc.

remote control
--

collaborate and try to control your neighbour's sounds by changing the following line in the javascript

```javascript
public var RemoteIP : String = "127.0.0.1";  //edit to match neighbour ip. e.g. "192.168.1.52"
```

as a last experiment we can try to broadcast to all. use this (only slightly modified) script in unity...

```javascript
//this code is another template for sending osc - edit to match your scene
#pragma strict

public var RemoteIP : String = "192.168.1.255";  //255= broadcast to all
public var SendToPort : int = 57120;
public var ListenerPort : int = 8400;
private var osc : Osc;
private var lastx : float;
private var lasty : float;
private var lastz : float;

function Start () {
    var udp : UDPPacketIO = GetComponent("UDPPacketIO");
    udp.init(RemoteIP, SendToPort, ListenerPort);
    osc = GetComponent("Osc");
    osc.init(udp);
}

function Update () {
    var fps= GameObject.Find("FPSController");
    var x : float = fps.transform.position.x;
    var y : float = fps.transform.position.y;
    var z : float = fps.transform.position.z;
    if((lastx!=x)||(lasty!=y)||(lastz!=z)) {  //filter out repetitions so only send when moving
        var msg : OscMessage;
        msg= Osc.StringToOscMessage("/fps "+x+" "+y+" "+z);
        osc.Send(msg);
        lastx= x;
        lasty= y;
        lastz= z;
    }
}

function OnDisable() {
    osc.Cancel();
    osc = null;
}
```

NOTE: this might not work on certain networks - the router have to be set up to allow broadcasting (which home routers usually are, while routers in institutions not).
