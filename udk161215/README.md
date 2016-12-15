advanced network
--------------------

here are some examples of setting up particle systems in unity and either control particles with supercollider or generate sound from particles colliding.

general setup
--

* create a new project in unity
* go to Edit / Project Settings / Player and tick 'Run In Background'
* go to https://github.com/heaversm/unity-osc-receiver and click the green download button
* get the .zip file and uncompress it
* find the folder Plugins in the zip you just uncompressed (unity-osc-receiver-master / Assets)
* drag&drop it into unity's assets window (bottom)
* select GameObject / Create Empty
* in the inspector select 'Add Component / Scripts / Osc'
* and again select 'Add Component / Scripts / UDP Packet IO'

particles triggered by microphone
--

* make sure GameObject is selected in the Hierarchy window and select 'Add Component' in the inspector
* select Effects / Particle System
* again select 'Add Component / New Script'
* call it something (here 'receiverSpawn'), make sure language is javascript and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the following code replacing what was there...

```javascript
//this code will emit new particles for incoming osc messages (from supercollider)
#pragma strict

public var RemoteIP : String = "127.0.0.1";
public var SendToPort : int = 57120;
public var ListenerPort : int = 8401;
private var ps : ParticleSystem;
private var osc : Osc;
private var num : int = 0;

function Start () {
    var udp : UDPPacketIO = GetComponent("UDPPacketIO");
    udp.init(RemoteIP, SendToPort, ListenerPort);
    osc = GetComponent("Osc");
    osc.init(udp);
    osc.SetAllMessageHandler(AllMessageHandler);
    ps= GetComponent.<ParticleSystem>();
    ps.enableEmission= false;
}

function Update () {
    if(num>0) {
        ps.Emit(num);
        num= 0;
    }
}

public function AllMessageHandler(oscMessage: OscMessage) {
    var msgString = Osc.OscMessageToString(oscMessage);
    var msgAddress = oscMessage.Address;
    var msgValue = oscMessage.Values;
    //Debug.Log(msgString);
    if(msgAddress=="/emit") {
        num= msgValue[0];
    }
}
```

save and go back to unity. it shoud look like this...

![01particlesystem](01particlesystem.png?raw=true "particlesystem")

click play and then switch over to supercollider and run the following code. it will track the amplitude from the microphone and send a value (1-10) over to unity depending on how loud the sound is.

```
s.boot;

(
var unity= NetAddr("127.0.0.1", 8401);
var lastNum= -1;
OSCdef(\amp, {|msg|
    var num= msg[3].explin(0.01, 1, 0, 10).round;
    if(lastNum!=num, {
        lastNum= num;
        if(num>0, {
            unity.sendMsg("/emit", num.postln);
        });
    });
}, \ampTracker);
{SendReply.kr(Impulse.kr(61), '/ampTracker', Amplitude.kr(SoundIn.ar, 0.05, 0.1)); DC.ar(0)}.play;
)
```

bouncing particles trigger sounds
--

first make sure you perform the [general setup](#general-setup) above.

* select GameObject / 3D Object / Plane
* select GameObject / Particle System
* in the inspector set the following:
  * set Position Y to 10 (to move the particles up)
  * set Rotation X to 0
  * set Start Speed to 0
  * set Gravity Modifier to 1
  * set Start Color to something else than White
* now scroll down and tick Collision
* expand Collision tab and set the following:
  * select Plane under Planes
  * untick Visualize Bounds
  * set Bounce to 0.5
  * tick Send Collision Messages

you scene should now look like this...

![02particlesystem](02particlesystem.png?raw=true "particlesystem")

* select Particle System in the Hierarchy window
* select Add Component / New Script in Inspector
* make sure it is an javascript and call something (here Collider)
* doubleclick and add the following code (replacing what was there)...

```javascript
#pragma strict

var part: ParticleSystem;
var collisionEvents: ParticleCollisionEvent[];
var obj: GameObject;

function Start() {
    part = GetComponent.<ParticleSystem>();
    collisionEvents = new ParticleCollisionEvent[16];
    obj= GameObject.Find("GameObject");
}

function OnParticleCollision(other: GameObject) {
    //Debug.Log(part);
    var safeLength = part.GetSafeCollisionEventSize();
    if(collisionEvents.Length < safeLength) {
        collisionEvents = new ParticleCollisionEvent[safeLength];
    }
    var numCollisionEvents = part.GetCollisionEvents(other, collisionEvents);
    for(var i= 0; i<numCollisionEvents; i++) {
        var pos= collisionEvents[i].intersection;
        var vel= collisionEvents[i].velocity;
        obj.SendMessage("Collide", String.Format("{0} {1} {2} {3} {4} {5} {6}", i, pos.x, pos.y, pos.z, vel.x, vel.y, vel.z));
    }
}
```
* now select the GameObject in the Hierarchy window
* select Add Compoment / New Script in Inspector
* make sure it is an javascript and call it Sender (note: the name is important this time)
* doubleclick and add the following code (replacing what was there)...

```javascript
#pragma strict

public var RemoteIP : String = "127.0.0.1";
public var SendToPort : int = 57120;
public var ListenerPort : int = 8402;
private var osc : Osc;

function Start () {
    var udp : UDPPacketIO = GetComponent("UDPPacketIO");
    udp.init(RemoteIP, SendToPort, ListenerPort);
    osc = GetComponent("Osc");
    osc.init(udp);
}

function Update () {
}

function Collide(data) {
    var msg : OscMessage;
    msg= Osc.StringToOscMessage("/collide "+data);
    osc.Send(msg);
}

function OnDisable() {
    osc.Cancel();
    osc = null;
}
```

now click play and go to supercollider. see incoming data with...

```
OSCFunc.trace(true, true);
```

then try this sounding example...

```
(
SynthDef(\coll, {|freq= 400, amp= 0.5, atk= 0.001, rel= 0.01, pan= 0|
    var env= EnvGen.ar(Env.perc(atk, rel, amp), doneAction:2);
    var snd= SinOsc.ar(freq);
    OffsetOut.ar(0, Pan2.ar(snd*env, pan));
}).add;
OSCdef(\coll, {|msg|
    var index, px, py, pz, vx, vy, vz;
    //msg.postln;
    index= msg[1];
    px= msg[2];
    py= msg[3];
    pz= msg[4];
    vx= msg[5];
    vy= msg[6];
    vz= msg[7];
    Synth(\coll, [\freq, (index+2)*200, \amp, vy.linlin(-10, 0, 1, 0)]);
}, \collide);
)
```

resources
--

<https://www.raywenderlich.com/113049/introduction-unity-particle-systems>
