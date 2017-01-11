projects
--------------------

midi input
--

for unity to take midi input from another program or from a hardware midicontroller do the following...

* go to <https://github.com/keijiro/MidiJack> and click the green download button
* get the zip file and uncompress it
* in unity select 'Assets / Import Package / Custom Package...'
* import the file 'MidiJack.unitypackage'
* select 'GameObject / 3D Object / Cube' to make a new cube
* select 'Add Component / New Script'
* call it something (here 'mymidi'), make sure language is **C sharp** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and save
* connect midi device and run the unity scene

```cs
using UnityEngine;
using MidiJack;

public class mymidi : MonoBehaviour {
    void Update() {
        var k1= MidiMaster.GetKnob(2);	//edit to match your CC - here nanokontrol
        var k2= MidiMaster.GetKnob(3);
        var k3= MidiMaster.GetKnob(4);
        var k4= MidiMaster.GetKnob(5);
        var k5= MidiMaster.GetKnob(6);
        var k6= MidiMaster.GetKnob(8);
        transform.localScale= new Vector3(k1, k2, k3);
        transform.localPosition= new Vector3(k4, k5, k6);
    }
}
```

now you should be able to move the cube around with the first six sliders on a korg nanokontrol (adapt GetKnob to match your midi device)

mic input
--

microphone or line-in audio to unity...

* select 'GameObject / Audio / Audio Source'
* select 'Add Component / New Script'
* call it something (here 'mic'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and save
* make sure you have 'built-in microphone' selected in your system sound input and run the unity scene

```javascript
#pragma strict

public var scale= 5.0;
private var samples : float[];
private var snd : AudioSource;
private var buffersize= 2.0;	//sound buffer in seconds

function Start() {
    snd= GetComponent.<AudioSource>();
    snd.clip= Microphone.Start("Built-in Microphone", true, buffersize, 44100);
    snd.loop= true;
    while(!(Microphone.GetPosition(null)>0)) {}
    //snd.Play();	//monitor
    samples= new float[snd.clip.samples*snd.clip.channels];
}
function Update() {
    snd.clip.GetData(samples, 0);
    for(var i= 0; i<samples.Length; i++) {
        var fi : float = i;
        var x= fi/samples.Length*scale;
        Debug.DrawLine(new Vector3(x, 0, 0), new Vector3(x, samples[i]*scale, 0), Color.green);
    }
}
```

you should see something like this...

![01mic](01mic.png?raw=true "mic")

fft
--

spectrum - TODO

routing sound
--

soundflower - TODO

https://github.com/mattingalls/Soundflower/releases get the 2.0b2
