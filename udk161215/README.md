advanced network
--------------------

particle system triggered by microphone...

* create a new project in unity
* set up osc (just like previous week(s) - see instructions <https://github.com/redFrik/udk16-Immersive_Technologies/tree/master/udk161201#unity>)
* go to Edit / Project Settings / Player and tick 'Run In Background'
* select the GameObject in hierarchy window and then click 'Add Component'
* select Effects / Particle System
* in the inspector select 'Add Component / New Script'
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

click play in unity and and then run the following code in supercollider. it will track the amplitude from the microphone and send a value (1-10) over to unity depending on how loud the sound is.

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

resources
--

<https://www.raywenderlich.com/113049/introduction-unity-particle-systems>
