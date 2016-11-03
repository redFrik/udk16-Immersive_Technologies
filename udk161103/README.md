basic supercollider, basic unity
--------------------

supercollider
--

```
s.boot

//--recording
b= Buffer.alloc(s, s.sampleRate*8);  //prepare 8 seconds of memory

{RecordBuf.ar(SoundIn.ar, b.bufnum, loop: 0, doneAction:2); DC.ar(0)}.play;  //this line will start recording for 8sec
//wait until finished (synth count (s) in lower right corner drops with 1)

b.plot;  //show the result
b.play;  //listen to the result
b.write  //save as a soundfile (on osx in ~/Music/SuperCollider Recordings/)


//--playback
//use mouse x position to set starting position
a= {TGrains.ar(2, Impulse.ar(4), b.bufnum, 1, MouseX.kr(0, 8), 0.3)}.play;
a.release;

//mouse y now control trigger rate
a= {TGrains.ar(2, Impulse.ar(MouseY.kr(1, 100, 1)), b.bufnum, 1, MouseX.kr(0, 8), 0.3)}.play;
a.release;

//change playback rate with random lfo
a= {TGrains.ar(2, Impulse.ar(MouseY.kr(1, 100, 1)), b.bufnum, LFNoise1.kr(1).range(0.8, 1.2), MouseX.kr(0, 8), 0.3)}.play;
a.release;

//etc.

//--soundfiles
s.recSampleFormat= "int32";  //only needed to run once
//now create a few different (+4) short soundfiles by recording the output of the above
s.record;
s.stopRecording;

//below we will import these into unity
```

unity
--

* start unity and create a new project
* select GameObject / 3D Object / Plane
* select GameObject / 3D Object / Cube

![box](01box.png?raw=true "box")

building a staircase...

* duplicate the cube a few times (cmd+d or ctrl click and select duplicate)
* build a staircase (click&drag cubes around with red, green, blue arrows)
* optionally hold down cmd to snap to grid (set snapsize under Edit / Snap Settings...)

![stair](02stair.png?raw=true "stair")

adding a character...

* select Assets / Import Package / Characters
* just click 'import' in the window that pops up to import everything
* go to 'Project' tab and then expand Assets
* find Standard Assets / Characters / FirstPersonCharacter / Prefabs / FPSController
* drag&drop FPSController onto the plane

![fps](03fps.png?raw=true "fps")

trying it out...

* press the play button (mouse = look around, space = jump, ADWS or arrow keys to move)
* try to climb the stairs (use jump)
* jump of the staris, look up and see your world disappear
* press 'esc' and the play button again to stop

adding sound...

* find four short soundfiles you recorded with supercollider above
* drag&drop them onto the Assets tab
* then select the FPSController in the Hierarchy (left)
* find 'Footstep Sounds' in the inspector window (right)
* drag&drop the four sounds from Assets onto Element 0, Element 1, Jump Sound, Land Sound
* it should look like in the screenshot below
* test it with play

![snd](04snd.png?raw=true "snd")

and there was time...

* select Directional Light in the Hierarchy (left)
* click the Add Component button in the inspector (right)
* find 'New Script' and make sure language is set to 'Java Script'
* click Create and Add

![script](05script.png?raw=true "script")

* doubleclick the script under Assets and MonoDevelop-Unity should open
* copy&paste in the code below replacing what was there

´´´javascript
#pragma strict

function Start () {
    print("hello");
}

function Update () {
    transform.Rotate(0.4, 0, 0);
}
´´´

* go back to unity and press play
* the sun should move around in the sky
* play around with the script
* stand on the top of the stairs and see the sun set (jump after)

resources
--

lots of good beginner tutorials <https://www.youtube.com/channel/UCRMXHQ2rJ9_0CHS7mhL7erg/playlists>
