projects
--------------------

kinect
--

NOTE: this was tested on mac osx with kinect v1 (model 1414). you will need a kinect sensor for this to work.

first install openni and nite. see instructions here... <https://github.com/redFrik/udk15-Surveillance_and_Analysis/tree/master/udk160526#advanced-kinect-skeleton>
(OSCeleton is not needed here but it might be worth installing that too)

then install libfreenect with `brew install libfreenect` and after that you should be able to try the kinect sensor with the command `freenect-glview`. if it works you should see a xquartz window with the depth image coming from the kinect sensor.

now unity...

* go to <http://zigfu.com/en/downloads/legacy/> and download Unity-OpenNI Bindings v1.4
* create a new unity 3d project
* double click the file UnityOpenNIBindings-v1.4.unitypackage that you downloaded
* now find and try the example '_/Scenes / MeshFromDepth'
* (also the skeleton tracking examples work)

now a custom example...

* make sure you have the example above open
* find the folder 'OpenNI' in the Assets window and drag&drop this on to your desktop

![01assets](01assets.png?raw=true "assets")

* create a new unity 3d project
* drag&drop the folder 'OpenNI' from your desktop on to the Assets window to import this
* select 'GameObject / Create Empty'
* select 'Add Component / New Script'
* call it 'DepthMap', make sure language is **C sharp** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and save
* connect the kinect device and run the unity scene

```csharp
using System;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using UnityEngine;
using OpenNI;

public class DepthMap : MonoBehaviour {
    short[] rawDepthMap;
    float maxDepth;
    int lastFrameId;
    int XRes;
    int YRes;
    int width;
    int height;
    int downsample = 10;		//go down from 640x480 to 64x48
    public float scale= 100;	//how far each ball should move in z dimension
    List<GameObject> balls = new List<GameObject> ();
    void Start() {
        MapOutputMode mom= OpenNIContext.Instance.Depth.MapOutputMode;
        XRes= mom.XRes;
        YRes= mom.YRes;
        maxDepth= (int)OpenNIContext.Instance.Depth.DeviceMaxDepth;
        rawDepthMap= new short[(int)(XRes*YRes)];
        Debug.Log (String.Format("kinect depthmap resolution: {0}x{1}", XRes, YRes));
        Debug.Log (String.Format("kinect maxdepth: {0}", maxDepth));
        width = XRes / downsample;
        height = YRes / downsample;
        Debug.Log (String.Format("kinect balls resolution: {0}x{1}", width, height));
        for (int i = 0; i < width*height; i++) {
            GameObject ball = GameObject.CreatePrimitive (PrimitiveType.Sphere);
            int x = i % width;
            int y = i / width;
            ball.transform.localPosition = new Vector3(x - (width / 2), (height / 2)-y, 35);
            balls.Add(ball);
        }
    }
    void Update() {
        if(lastFrameId!=OpenNIContext.Instance.Depth.FrameID) {
            lastFrameId= OpenNIContext.Instance.Depth.FrameID;
            Marshal.Copy(OpenNIContext.Instance.Depth.DepthMapPtr, rawDepthMap, 0, rawDepthMap.Length);
            for (int i = 0; i < width * height; i++) {
                GameObject ball = balls [i];
                Vector3 pos = ball.transform.localPosition;
                int x = i % width;
                int y = i / width;
                pos.z = lookupRawDepth(x, y);	//simple sampling that ignore pixels in between
                ball.transform.localPosition = pos;
            }
        }
    }
    float lookupRawDepth(int x, int y) {
        return (rawDepthMap [(x*downsample) + ((y*downsample) * XRes)] / maxDepth) * scale;
    }
}
```

![02kinect](02kinect.png?raw=true "kinect")

NOTE: some times you need to unplug and plug in the kinect and then restart unity a few times before it works.

ffts
--

this example takes five channels of audio, calculates the fft and sends that data over to unity via osc. the five spheres will have their textures change according to the spectra of the sounds.

* create a new 2d project in unity
* create 5 spheres and call them "Sphere (0)", "Sphere (1)", "Sphere (2)", "Sphere (3)", "Sphere (4)"
* spread them out on the x axis by setting the x positions to -4, -2, 0, 2, 4
* scale up the middle one (Sphere (2))
* select 'GameObject / Light / Directional Light'
* go to Edit / Project Settings / Player and tick 'Run In Background'
* go to https://github.com/heaversm/unity-osc-receiver and click the green download button
* get the .zip file and uncompress it
* find the folder Plugins in the zip you just uncompressed (unity-osc-receiver-master / Assets)
* drag&drop it into unity's assets window (bottom)
* select 'GameObject / Create Empty'
* in the inspector select 'Add Component / Scripts / Osc'
* and again select 'Add Component / Scripts / UDP Packet IO'
* select 'Add Component / New Script'
* call it something (here 'ffts'), make sure language is **javascript** and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there and run

```javascript
#pragma strict

public var RemoteIP : String = "127.0.0.1";
public var SendToPort : int = 57120;
public var ListenerPort : int = 9876;
private var osc : Osc;
private var inputs= [20, 21, 22, 23, 24];	//must match sc code
private var objects= ["Sphere (0)", "Sphere (1)", "Sphere (2)", "Sphere (3)", "Sphere (4)"];
private var fftsize= 128;	//must match sc code
private var maxResolution= 256;
public var resolution= 1;
public var amp= 1.0;
private var spectrums : float[,];
private var textures : Texture2D[];

function Start() {
    var udp : UDPPacketIO = GetComponent("UDPPacketIO");
    udp.init(RemoteIP, SendToPort, ListenerPort);
    osc = GetComponent("Osc");
    osc.init(udp);
    osc.SetAllMessageHandler(AllMessageHandler);
    textures= new Texture2D[inputs.Length];
    spectrums= new float[inputs.Length, fftsize];
    for(var i= 0; i<inputs.Length; i++) {
        var texture= new Texture2D(maxResolution, fftsize);
        textures[i]= texture;
        GameObject.Find(objects[i]).GetComponent.<Renderer>().material.mainTexture= texture;
    }
}
function Update() {
    var columns= Mathf.Clamp(resolution, 1, maxResolution);
    var columnWidth= maxResolution/columns;
    var offset= columnWidth*(Time.frameCount%columns);
    for(var i= 0; i<inputs.Length; i++) {
        for(var y= 0; y<fftsize; y++) {
            var val= spectrums[i, y]*amp;
            var color: Color= Color(0, val, 0);	//green
            for(var x= 0; x<columnWidth; x++) {
                textures[i].SetPixel(offset+x, y, color);
            }
        }
        textures[i].Apply();
    }
}
public function AllMessageHandler(oscMessage: OscMessage) {
    var msgAddress = oscMessage.Address;
    var msgValue = oscMessage.Values;
    if(msgAddress == "/fft") {
        var channelIndex= System.Convert.ToInt32(msgValue[0])-inputs[0];	//fragile
        for(var i= 1; i<msgValue.Count; i++) {
            spectrums[channelIndex, i-1]= msgValue[i];
        }
    }
}
```

![03ffts](03ffts.png?raw=true "ffts")

last run this code in supercollider.

```supercollider
(  //run once
s.options.numInputBusChannels= 32;
s.latency= 0.05;
s.reboot;
s.meter;
)

(
s.waitForBoot{
    var inputs= #[20, 21, 22, 23, 24];  //input audio channels (counting from 0)
    var unity= NetAddr("127.0.0.1", 9876);  //osc port
    var buffers= inputs.collect{Buffer.alloc(s, 128)};  //fft size
    CmdPeriod.doOnce({buffers.do{|b| b.free}});
    s.sync;
    inputs.do{|bus, i|
        {
            var snd= Pulse.ar(i*999+99)+SoundIn.ar;
            //var snd= In.ar(bus);  //here use input from ableton via soundflower
            FFT(buffers[i], snd);
            DC.ar(0);
        }.play;
        Routine.run({
            inf.do{
                buffers[i].loadToFloatArray(action: {|arr|
                    unity.sendMsg(\fft, *([bus]++arr.abs.sqrt));
                });
                (1/30).wait;  //framerate
            };
        });
    };
};
)
```

NOTE: if you want to route sound data from e.g. from abletone via soundflower to supercollider, you will need to adapt the supercollider in the `var snd` part.
