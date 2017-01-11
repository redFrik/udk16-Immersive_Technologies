network
--------------------

osc = open sound control

supercollider
--

NOTE: everyone should be connected to the same network for the following to work.

and also make sure your firewall is not blocking incomming udp connections on ports 57110 (scserver) and 57120 (sclang). (on osx you are often asked when starting programs if you want to allow incoming network connections or not - select allow for supercollider and unity).

```
OSCFunc.trace(true, true);  //just post what comes in to sc on port 57120

n= NetAddr("127.0.0.1", 57120);  //your own ip address (aka loopback or localhost)
n.sendMsg(\test, 1, 2, 3);  //send to yourself

"ifconfig".unixCmd;  //post your own ip number (find it in there somewhere)

n= NetAddr("192.168.1.129", 57120);  //also your ip address but given from the router
n.sendMsg(\test, 2, 3, 4);  //also send to yourself but using the public ip

"arp -a".unixCmd;  //try to list ip numbers of all devices on this network

n= NetAddr("192.168.1.142", 57120);  //set this ip to your neighbour's ip
n.sendMsg(\test, 3, 4, 5);  //send to your neighbour

s.boot;

~lars= Server("lars", NetAddr("192.168.1.142", 57110));  //the sound server on your neighbours computer
//~lars.boot  //not allowed to boot from remote - so ask your neighbour to run s.boot if (s)he hasn't already
a= {SinOsc.ar([400, 404], 0, LFSaw.ar(1))}.play(~lars);  //play a sound on your neighbouts computer
a.release(2);

~lars.makeWindow;  //status window - just to see what is going on
```

set up osc receivers in supercollider

```
s.boot;

(
OSCdef(\something, {|msg|
    msg.postln;
    {SinOsc.ar(msg[1], 0, Line.kr(1, 0, 0.2, doneAction:2)).dup(2)}.play;
}, \hallo);
OSCdef(\else, {|msg|
    msg.postln;
    {Pulse.ar(msg[1], 0.4, Line.kr(0.5, 0, msg[2], doneAction:2)).dup(2)}.play;
}, \hej);
)

//NOTE these receivers will disappear when you press the panic button cmd+. (or alt+.)
//if that happens just run the above code again

n= NetAddr("127.0.0.1", 57120);
n.sendMsg(\hallo, 505);
n.sendMsg(\hallo, 606);
n.sendMsg(\hallo, 808);
n.sendMsg(\hej, 909, 0.7);
n.sendMsg(\hej, 1200, 2);
```

now try to send to neighbour computers...

```
n= NetAddr("192.168.1.142", 57120);  //edit to match your neighbour's computer ip
n.sendMsg(\hallo, 505);

//this will step through an array of addresses and send messages to them in sequence
(
Routine.run({
    var arr= [NetAddr("127.0.0.1", 57120), NetAddr("192.168.1.142", 57120)];  //add more here
    12.do{|i|
        arr.wrapAt(i).sendMsg(\hallo, i+1*100);
        0.2.wait;
    };
});
)
```

unity
--

* go to <https://github.com/heaversm/unity-osc-receiver> and click the green download button
* get the .zip file and uncompress it
* start unity and create a new project
* find the folder Plugins in the zip you just uncompressed (unity-osc-receiver-master / Assets)
* drag&drop it into unity's assets window (bottom)
* select GameObject / Create Empty
* in the inspector select 'Add Component / Scripts / Osc'
* and again select 'Add Component / Scripts / UDP Packet IO'
* your scene should now look like this and these steps are always needed when you want to send and receive osc...

![01init](01init.png?raw=true "init")

now let us create a custom receiver script.

* make sure the GameObject is selected in Hierarchy window like before
* in the inspector select 'Add Component / New Script'
* call it something (here 'receiver'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the following code replacing what was there...

```javascript
//this code is a template for receiving osc - edit to match your scene
#pragma strict

public var RemoteIP : String = "127.0.0.1";
public var SendToPort : int = 57120;
public var ListenerPort : int = 8400;
private var osc : Osc;

public var crx : float = 0;
public var cry : float = 0;
public var crz : float = 0;
public var sphereScale : Vector3 = Vector3(1, 2, 3);

function Start () {
    var udp : UDPPacketIO = GetComponent("UDPPacketIO");
    udp.init(RemoteIP, SendToPort, ListenerPort);
    osc = GetComponent("Osc");
    osc.init(udp);
    osc.SetAllMessageHandler(AllMessageHandler);
}

function Update () {
    GameObject.Find("Cube").transform.Rotate(crx, cry, crz);
    GameObject.Find("Sphere").transform.localScale= sphereScale;
}

public function AllMessageHandler(oscMessage: OscMessage) {
    var msgString = Osc.OscMessageToString(oscMessage);
    var msgAddress = oscMessage.Address;
    var msgValue = oscMessage.Values;
    Debug.Log(msgString);
    if(msgAddress == "/Cube") {
        crx= msgValue[0];
        cry= msgValue[1];
        crz= msgValue[2];
    } else if(msgAddress == "/Sphere") {
        sphereScale.x= msgValue[0];
        sphereScale.y= msgValue[1];
        sphereScale.z= msgValue[2];
    }
}
```

the script above expects a Cube and a Sphere in the scene. to add them do this...

* select GameObject / 3D Object / Cube
* select GameObject / 3D Object / Sphere

and before running, for the scene not to halt when we use supercollider, do the following...

* go to Edit / Project Settings / Player and tick 'Run In Background'

![02run_background](02run_background.png?raw=true "run_background")

* now hit run, switch over to supercollider and try the following code...

```
//supercollider code:
//use with example script 'receiver'
n= NetAddr("127.0.0.1", 8400);
n.sendMsg("/Cube", 0, 0, 0.5)
n.sendMsg("/Sphere", 1, 5, 1)
```

you should see the cube and sphere change when you send these commands. try with different values.

then try the following code which takes sound input from the built-in microphone, does amplitude tracking and then sends over that data to unity.

```
//mic amplitude controls sphere height
(
n= NetAddr("127.0.0.1", 8400);
s.waitForBoot{
    {SendReply.kr(Impulse.kr(60), '/amp', Amplitude.kr(SoundIn.ar, 0.01, 0.1).lag(0.1)); DC.ar(0)}.play;
    OSCdef(\amp, {|msg|
        //msg.postln;  //debug
        n.sendMsg("/Sphere", 1, msg[3]*10, 1);
    }, \amp);
};
)
```

last we edit the receiver script in MonoDevelop a little bit. now only the cube is active and instead of rotating, it will change position.

```javascript
//this code is a template for receiving osc - edit to match your scene
#pragma strict

public var RemoteIP : String = "127.0.0.1";
public var SendToPort : int = 57120;
public var ListenerPort : int = 8400;
private var osc : Osc;

public var crx : float = 0;
public var cry : float = 0;
public var crz : float = 0;
//public var sphereScale : Vector3 = Vector3(1, 2, 3);

function Start () {
    var udp : UDPPacketIO = GetComponent("UDPPacketIO");
    udp.init(RemoteIP, SendToPort, ListenerPort);
    osc = GetComponent("Osc");
    osc.init(udp);
    osc.SetAllMessageHandler(AllMessageHandler);
}

function Update () {
    GameObject.Find("Cube").transform.localPosition= Vector3(crx, cry, crz);
    //GameObject.Find("Sphere").transform.localScale= sphereScale;
}

public function AllMessageHandler(oscMessage: OscMessage) {
    var msgString = Osc.OscMessageToString(oscMessage);
    var msgAddress = oscMessage.Address;
    var msgValue = oscMessage.Values;
    Debug.Log(msgString);
    if(msgAddress == "/Cube") {
        crx= msgValue[0];
        cry= msgValue[1];
        crz= msgValue[2];
    } //else if(msgAddress == "/Sphere") {
        //sphereScale.x= msgValue[0];
        //sphereScale.y= msgValue[1];
        //sphereScale.z= msgValue[2];
    //}
}
```

and with the following supercollider code you should see the cube move up and down depending on pitch.

```
//frequency controls cube y-position
(
n= NetAddr("127.0.0.1", 8400);
s.waitForBoot{
    {
        var mf= SinOsc.kr(1+SinOsc.ar(0.1)*3).exprange(200, 2000);
        SendReply.kr(Impulse.kr(60), '/freq', mf);
        SinOsc.ar(mf, 0, 0.5).dup(2);
    }.play;
    OSCdef(\freq, {|msg|
        msg.postln;  //debug
        n.sendMsg("/Cube", 1, msg[3].linlin(200, 5000, 0, 10), 1);
    }, \freq);
};
)
```

also try to send from your supercollider to your neighbour's unity program.
