more supercollider, more unity
--------------------

supercollider
--

```supercollider
s.boot

//--loading a soundfile
//drag and drop a file onto this document to see the path (not mp3)
//then copy and paste that into the line below
b.free; b= Buffer.readChannel(s, "/Users/asdf/Desktop/sounds/a11wlk01-44_1.aiff", channels:[0]);  //here edit path to your soundfile

//--playback
//use mouse x position to set starting position
a= {TGrains.ar(2, Impulse.ar(4), b.bufnum, 1, MouseX.kr(0, b.duration), 0.3)}.play;
a.release;

//mouse y now control trigger rate
a= {TGrains.ar(2, Impulse.ar(MouseY.kr(1, 100, 1)), b.bufnum, 1, MouseX.kr(0, b.duration), 0.3)}.play;
a.release;

//adding a sine oscillator that slowly varies the starting position (offset)
a= {TGrains.ar(2, Impulse.ar(MouseY.kr(1, 100, 1)), b.bufnum, 1, MouseX.kr(0, b.duration)+SinOsc.kr(1).range(-0.1, 0.1), 0.3)}.play;
a.release

//change playback rate with an sine oscillator
a= {TGrains.ar(2, Impulse.ar(MouseY.kr(1, 100, 1)), b.bufnum, SinOsc.kr(1).range(0.5, 2), MouseX.kr(0, b.duration), 0.3)}.play;
a.release;

//more oscillator control (no mouse interaction here)
a= {TGrains.ar(2, Impulse.kr(SinOsc.kr(1).range(1, 10)), b.bufnum, SinOsc.kr(1.1).exprange(0.3, 3), SinOsc.kr(0.1).range(0, b.duration), 0.3)}.play;
a.release;
```

unity
--

using the webcamera as a texture...

* start unity and create a new project
* select GameObject / 3D Object / Plane
* set the transform scale to  x 5, y 1, z 5 in the plane inspector
* optionally set the transform y rotation to 180 in the plane inspector
* select add component at the bottom of the plane inspector
* select new script, make sure language is set to **javascript** and call it something (here 'webcam')
* your scene should now look like this...

![webcam](01webcam.png?raw=true "webcam")

* doubleclick the script under assets to open it in mono develop
* add the following code...

```javascript
#pragma strict

function Start() {
    var webcamTexture: WebCamTexture = new WebCamTexture();
    var renderer: Renderer = GetComponent.<Renderer>();
    renderer.material.mainTexture = webcamTexture;
    webcamTexture.Play();
}
```

adding more objects to the scene...

* save and go back to unity
* click 'play' and you should see video from your webcamera mapped onto the plane
* add some more 3d game objects (here 'sphere')
* drag and drop the webcam script onto the objects in the hierarchy list
* dont forget to position, rotate and scale the objects

![more](02more.png?raw=true "more")

changing the main camera...

* select main camera in the hierarchy list
* click 'play' to go into run mode
* play around with position, rotation and scale in the camera inspector
* the picture here below show settings i found fun
* also play around with the projection setting - try with 'orthographic'
* when you're happy remember the settings, click 'stop' and then make them permanent by write them into your scene settings

![camera](03camera.png?raw=true "camera")

adding a character...

* select Assets / Import Package / Characters
* just click 'import' in the window that pops up to import everything
* go to 'Project' tab and then expand Assets
* find Standard Assets / Characters / ThirdPersonCharacter / Prefabs / ThirdPersonController
* drag&drop ThirdPersonController onto the plane
* click 'play' and try running around with the arrow keys - space to jump

![tpc](04tpc.png?raw=true "tpc")

connecting the main camera to the character...

* in the hierarchy list, drag and drop the 'Main Camera' onto the thirdpersoncontroller
* position the camera with the inspector to sit slightly behind and above the character

![tpccamera](05tpccamera.png?raw=true "tpccamera")

* play around with settings in the inspector window
* try increasing the jump power, decreasing gravity multiplier etc
* also try turning off 'Skinned Mesh Renderer' for EthanBody and EthanGlasses
* change the main camera x rotation to 90 (looking down onto the plane)

![tpcsettings](06tpcsettings.png?raw=true "tpcsettings")

etc etc. explore.
you can also try the 'RollerBall' character and attach the main camera to that. then roll around on top of your webcamera texture.

resources
--

more advanced unity tutorials <https://www.youtube.com/user/SpeedTutor/videos>

Eli's supercollider tutorials <https://www.youtube.com/watch?v=yRzsOOiJ_p4&list=PLPYzvS8A_rTaNDweXe6PX4CXSGq4iEWYC>
