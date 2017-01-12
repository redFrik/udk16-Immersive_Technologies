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

* make a new unity 3d project
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
    snd.clip= Microphone.Start(null, true, buffersize, 44100);
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

to extract the spectrum of audio you can use the built-in GetSpectrumData method.

* make a new unity 3d project
* select 'GameObject / Audio / Audio Source'
* select 'Add Component / New Script'
* call it something (here 'fft'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and save
* make sure you have 'built-in microphone' selected in your system sound input and run the unity scene

```javascript
#pragma strict

public var scalex= 1.5;
public var scaley= 5.0;
private var spectrum : float[];
private var snd : AudioSource;
private var buffersize= 512;    //fft buffer size in samples (must be power-of-two)

function Start() {
    snd= GetComponent.<AudioSource>();
    snd.clip= Microphone.Start(null, true, 1, 44100);
    snd.loop= true;
    while(!(Microphone.GetPosition(null)>0)) {}
    snd.Play();   //must be playing for GetSpectrumData to work
    spectrum= new float[buffersize];
}
function Update() {
    snd.GetSpectrumData(spectrum, 0, FFTWindow.Hanning);
    for(var i= 1; i<spectrum.Length-1; i++) {
        Debug.DrawLine(new Vector3(Mathf.Log(i-1)*scalex, spectrum[i-1]*scaley, 0), new Vector3(Mathf.Log(i)*scalex, spectrum[i]*scaley, 0), Color.green);
    }
}
```

routing sound
--

on mac osx you can use the free program soundflower to send audio directly from one applications to another.

* go to <https://github.com/mattingalls/Soundflower/releases> and get the 2.0b2 version
* install and restart your computer
* find Applications / Utilities / Audio Midi Setup and create an aggregated device (+)
* call it something (here 'builtin+soundflower') and set it up like in this screenshot...

![02soundflower](02soundflower.png?raw=true "soundflower")

* go to System Preferences / Audio / Input and select 'Soundflower (2ch)'
* go to System Preferences / Audio / Output and select 'builtin+soundflower'
* start supercollider and run the following code...

```
s.options.numOutputBusChannels= 4;
s.reboot

a= {Saw.ar([400, 404, 505, 606], LFSaw.ar([1, 2, 3, 4]))}.play; //output 4channels, 0-1 speakers, 2-3 soundflower
a.release;
```

* go to unity
* select 'Edit / Project Settings / Player'
* tick 'Run In Background'

![03background](03background.png?raw=true "background")

* run and you should see the sound from supercollider (output channels 2-3)

audio latency
--

optionally to make the graphics react faster you can decrease the audio latency in unity.

* go to 'Edit / Project Settings / Audio'
* set 'DSP Buffer Size' to 'Best latency'

![04latency](04latency.png?raw=true "latency")

falling objects
--

this example automatically creates a number of objects (prefab) and then make them fall down onto a plane. it demonstrates how to instantiate objects, make a prefab and tag objects etc.

see <https://docs.unity3d.com/Manual/InstantiatingPrefabs.html>

* make a new unity 3d project (here we called 'fall')
* select 'GameObject / 3D Object / Plane'
* select 'GameObject / 3D Object / Sphere'
* select 'Component / Physics / Rigidbody'
* select 'Assets / Create / Material'
* call it something (here 'sphmat')
* edit the material in the inspector - set colour, metallic, smoothness etc
* select the 'Sphere' in the inspector window
* drag&drop the material onto the materials element 0 in the inspector window
* your scene should now look like this...

![05falling1](05falling1.png?raw=true "falling1")

* now drag&drop the 'Sphere' from the hierarchy window to your assets (next to 'sphmat')
* then delete the 'Sphere' from the scene (ctrl+click in the hierarchy window and select delete)
* your scene should now look like this...

![05falling2](05falling2.png?raw=true "falling2")

* select 'GameObject / Create Empty'
* in the inspector window click 'Tag / Add Tag...'
* click the + sign to make a new tag - here we call it 'ball'
* select the 'GameObject' again in the hierarchy window
* select 'Add Component / New Script'
* call it something (here 'falling'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and save

```javascript
#pragma strict

public var prefab : GameObject;
public var radius= 5;
public var num= 30;	//how many objects
public var speed= 2;
public var height= 4;
private var cnt= 0;

function Start() {
    for(var i= 0; i<num; i++) {
        var angle= i*Mathf.PI*2/num;
        var pos= Vector3(Mathf.Cos(angle), 1, Mathf.Sin(angle))*radius;
        var obj= Instantiate(prefab, pos, Quaternion.identity);
        obj.tag= "ball";
    }
}
function Update() {
    var objects : GameObject[];
    objects= GameObject.FindGameObjectsWithTag("ball");
    if(Time.frameCount%speed==0) {
        var index= cnt%objects.Length;
        objects[index].transform.position.y= height;
        cnt= cnt+1;
    }
}
```

* back in unity drag&drop the 'Sphere' from assets window to 'Prefab' in gameobject inspector
* press play and you should see balls falling like this...

![05falling2](05falling2.png?raw=true "falling2")
