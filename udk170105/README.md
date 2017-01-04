projects and vr
--------------------


virtual reality
--

how to set up osc broadcast from vive vr head+controllers (absolute position & rotation) using unity.

NOTE: this will only work with windows machines and [HTC Vive](https://www.vive.com) headsets.

* create a new project in unity
* go to Edit / Project Settings / Player and tick 'Run In Background'

install the SteamVR Plugin...

* go to Asset Store and search for 'steamvr'
* find and import the 'SteamVR Plugin'
* click on 'import' and then 'Accept All' in the two popup windows
* drag the three prefabs 'CameraRig', 'Status' and 'SteamVR' from Assets / SteamVR / Prefabs into the Hierarchy window

fix the main camera offset 'bug'...

* select 'Main Camera' in Hierarchy window
* in the inspector select 'Add Component / Scripts / Steam VR_Camera'
* edit the Transform Position to be 0, 0, 0
* optionally add a Cube in the middle so it is easier to orient yourself

install the osc plugins...

* go to https://github.com/heaversm/unity-osc-receiver and click the green download button
* get the .zip file and uncompress it
* find the folder Plugins in the zip you just uncompressed (unity-osc-receiver-master / Assets)
* drag&drop it into unity's assets window (bottom)
* select GameObject / Create Empty
* in the inspector select 'Add Component / Scripts / Osc'
* and again select 'Add Component / Scripts / UDP Packet IO'
* select 'Add Component / New Script'
* call it something (here 'vrosc'), make sure language is javascript and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there
* in the code edit the 'Remote IP' to match your network (.255 in the end will broadcast)
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

//public var RemoteIP : String = "194.95.203.102";	//to a single laptop running sc
public var RemoteIP : String = "194.95.203.255";	//broadcast to all laptops running sc on network
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

reference
--

https://forum.unity3d.com/threads/unity-vr-samples-now-available.372753/
