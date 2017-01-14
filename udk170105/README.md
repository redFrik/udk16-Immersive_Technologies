projects and vr
--------------------

presentation of own projects

projects
--

questions for presentations...

* what is the general concept (how will it look, sound, work)?
* how will it be presented (standalone, web, performance, installation...)?
* who is it for (yourself, single player, group of people collaborating, general audience, showcase...)?
* how will i do it and what parts do i need help with (from tutor or fellow students)?

some suggested projects (if you do not have any ideas)...

* oscilloscope - take live sound input from supercollider (or any other program) and make a standalone unity app that draw the waveforms.
  * figure out how soundflower works
  * extract the audio data from soundflower into an array of numbers
  * code a script that draw lines from an array of numbers
  * build a scene for your line drawings - perhaps add a character to be able to move around
  * create an app and release the standalone
* portfolio - an online webapp where visitors can browse your works by moving around between pictures.
  * compile a list of works and a picture for each of them
  * build a scene, add a controller and place the pictures
  * make a script that show info text when you come close (or similar)
  * create a webapp and put up online
* sequencer - make a scene that you can run around in and objects that act as note triggers in supercollider.
  * program a triggable drum kit or synthesizer in supercollider
  * build a scene, add a controller
  * code a script to place objects (in patterns, grid structure etc)
  * make the objects collision send out osc triggers
* mobile - create an app for ios and/or android that uses gps position to generate some generative graphics
  * figure out how to get gps coordinates into unity (LocationInfo)
  * build a scene with a script that generates dynamic graphics and perhaps add sound
  * learn how to compile unity scenes for ios and android
  * try it out on a few different mobile devices
* virtual reality - build something immersive for the htc vive system
  * get permission to access the machines
  * set up a simple project (like below but without osc)
  * get everything to work in the simple project... calibration, room dimensions, offsets etc
  * now expand and create your own scene

virtual reality
--

how to set up osc sending from vive vr head+controllers (absolute position & rotation) using unity.

NOTE: this will only work with windows machines and [HTC Vive](https://www.vive.com) system.

* create a new project in unity
* go to Edit / Project Settings / Player and tick 'Run In Background'

install the SteamVR Plugin...

* go to Asset Store and search for 'steamvr'
* find and import the 'SteamVR Plugin'
* click on 'import' in the first and then 'Accept All' in the second popup window
* drag&drop the three prefabs 'CameraRig', 'Status' and 'SteamVR' from Assets / SteamVR / Prefabs into the Hierarchy window

fix the main camera offset 'bug'...

* select 'Main Camera' in Hierarchy window
* in the inspector select 'Add Component / Scripts / Steam VR_Camera'
* edit the Transform Position to be 0, 0, 0
* optionally add a Cube in the middle so it is easier to orient yourself
* press play and make sure the headset is tracking and that you are in the correct position

install the osc plugins...

* go to https://github.com/heaversm/unity-osc-receiver and click the green download button
* get the .zip file and uncompress it
* find the folder Plugins in the zip you just uncompressed (unity-osc-receiver-master / Assets)
* drag&drop it into unity's assets window (bottom)
* select GameObject / Create Empty
* in the inspector select 'Add Component / Scripts / Osc'
* and again select 'Add Component / Scripts / UDP Packet IO'
* select 'Add Component / New Script'
* call it something (here 'vrosc'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there
* in the code edit the 'Remote IP' to match your receiving laptop
* select GameObject in Hierarchy window and drag the following three things onto the inspector
  * Camera (head) drag to 'Camhead'
  * Controller (left) drag to 'Ctrlleft'
  * Controller (right) drag to 'Ctrlright'
* press run and switch over to supercollider. run `OSCFunc.trace` to see if it is working.

```javascript
//for use with SteamVR and unity-osc-receiver
//make sure to set the three gameobjects:
//  camhead - "Main Camera (head)"
//  ctrlleft - "Main Camera (head)"
//  ctrlright - "Main Camera (head)"

//osc protocol:
//	/startup
//	/shutdown
//	/camhead posx posy posz rotx roty rotz
//	/ctrlleft posx posy posz rotx roty rotz
//	/ctrlright posx posy posz rotx roty rotz

#pragma strict

public var RemoteIP : String = "194.95.203.102";	//to a single laptop running sc
//public var RemoteIP : String = "194.95.203.255";	//broadcast to all laptops running sc on network
public var SendToPort : int = 57120;
private var ListenerPort : int = 8400;	//unused
public var camhead : GameObject;
public var ctrlleft : GameObject;
public var ctrlright : GameObject;
private var osc : Osc;

function Start() {
    var udp : UDPPacketIO = GetComponent("UDPPacketIO");
    udp.init(RemoteIP, SendToPort, ListenerPort);
    osc = GetComponent("Osc");
    osc.init(udp);
    var msg : OscMessage = Osc.StringToOscMessage("/startup");
    osc.Send(msg);
}
function Update() {
    var msg : OscMessage;
    msg= Osc.StringToOscMessage("/camhead "
    +camhead.transform.position.x+" "
    +camhead.transform.position.y+" "
    +camhead.transform.position.z+" "
    +camhead.transform.rotation.x+" "
    +camhead.transform.rotation.y+" "
    +camhead.transform.rotation.z
);
osc.Send(msg);
    msg= Osc.StringToOscMessage("/ctrlleft "
        +ctrlleft.transform.position.x+" "
        +ctrlleft.transform.position.y+" "
        +ctrlleft.transform.position.z+" "
        +ctrlleft.transform.rotation.x+" "
        +ctrlleft.transform.rotation.y+" "
        +ctrlleft.transform.rotation.z
    );
    osc.Send(msg);
    msg= Osc.StringToOscMessage("/ctrlright "
        +ctrlright.transform.position.x+" "
        +ctrlright.transform.position.y+" "
        +ctrlright.transform.position.z+" "
        +ctrlright.transform.rotation.x+" "
        +ctrlright.transform.rotation.y+" "
        +ctrlright.transform.rotation.z
    );
    osc.Send(msg);
}
function OnDisable() {
    var msg : OscMessage = Osc.StringToOscMessage("/shutdown");
    osc.Send(msg);
    osc.Cancel();
    osc = null;
}
```

and last a supercollider example that uses a single hand controller's position and rotation to scan through sound fragments in a soundfile.

```supercollider
(
//scanning through a soundfile using a single controller (left)
s.latency= 0.05;
s.waitForBoot{
    b.free; b= Buffer.readChannel(s, "/Users/asdf/ND_BeatMixA125-01.wav", channels:[0]);  //here edit path to your soundfile
s.sync;
a= {
    var pos= \pos.kr([0, 0, 0], 0);
    var posmin= RunningMin.kr(pos);
    var posmax= RunningMax.kr(pos);
    var posnorm= pos-posmin/(posmax-posmin).max(0.001);
    var rot= \pos.kr([0, 0, 0], 0);
    var rotmin= RunningMin.kr(rot);
    var rotmax= RunningMax.kr(rot);
    var rotnorm= rot-rotmin/(rotmax-rotmin).max(0.001);
    TGrains.ar(2, Impulse.ar(rotnorm[0].linexp(0, 1, 10, 150)), b.bufnum, posnorm[1].linlin(0, 1, 0.9, 2), posnorm[0]*b.duration, posnorm[2].linlin(0, 1, 0.1, 1))*rotnorm[1]*0.5
}.play;
OSCdef(\ctrlleft, {|msg|
    var pos= msg.copyRange(1, 3);
    var rot= msg.copyRange(4, 6);
    a.set(\pos, pos, \rot, rot);
}, \ctrlleft);
};
)
```

NOTE: if the osc communication is jerky, make sure to click 'Maximize on play'

reference
--

https://forum.unity3d.com/threads/unity-vr-samples-now-available.372753/
