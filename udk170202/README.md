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
