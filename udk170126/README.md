projects
--------------------

grid
--

taking webcamera input from MaxMspJitter and sending a 64x48 grascale matrix at 30fps over osc to unity.

* create a new 3d project in unity
* go to Edit / Project Settings / Player and tick 'Run In Background'
* go to https://github.com/heaversm/unity-osc-receiver and click the green download button
* get the .zip file and uncompress it
* find the folder Plugins in the zip you just uncompressed (unity-osc-receiver-master / Assets)
* drag&drop it into unity's assets window (bottom)
* select GameObject / Create Empty
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

you should see a grid of spheres. then download and start the max patch 'grid.maxpat' that is available in the same git repository folder as this readme (scroll to the top of the page). run it and you should see something like in the screenshot below (which is showung my face and hand)...

![01grid](01grid.png?raw=true "grid")