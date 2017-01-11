phasing
--------------------

binaural beats - <https://en.wikipedia.org/wiki/Binaural_beats>

online generator - <http://fractalpanda.com/binaural-beats-generator/>

supercollider
--

playing around with beating sines / binaural beats...

```
a= {SinOsc.ar([300, 308], 0, 0.5)}.play;  //alpha
a.release(2);

a= {SinOsc.ar([300, 304.5], 0, 0.5)}.play;  //theta
a.release(2);

a= {SinOsc.ar([300, 302], 0, 0.5)}.play;  //delta
a.release(2);

a= {SinOsc.ar([300, 300+MouseX.kr(0, 50).poll]+MouseY.kr(-100, 100), 0, 0.5)}.play;  //xy control
a.release(2);


a= {SinOsc.ar([200, 201], 0, 0.5)}.play(fadeTime: 20);
a.release;
b= {SinOsc.ar([300, 302.2], 0, 0.5)}.play(fadeTime: 20);
b.release;
c= {SinOsc.ar([400, 403.3], 0, 0.5)}.play(fadeTime: 20);
c.release;
d= {SinOsc.ar([500, 504.4], 0, 0.5)}.play(fadeTime: 20);
d.release;
//etc


//same thing but with a 'fatter' sound using SinOscFB
a= {SinOscFB.ar([200, 201], 1, 0.5)}.play(fadeTime: 20);
a.release;
b= {SinOscFB.ar([300, 302.2], 1, 0.5)}.play(fadeTime: 20);
b.release;
c= {SinOscFB.ar([400, 403.3], 1, 0.5)}.play(fadeTime: 20);
c.release;
d= {SinOscFB.ar([500, 504.4], 1, 0.5)}.play(fadeTime: 20);
d.release;
e= {SinOscFB.ar([50, 51], 1, 0.5)}.play(fadeTime: 20);
e.release;
//etc
```

unity
--

first we create a cube with a light attached...

* start unity and create a new project
* select GameObject / 3D Object / Plane
* select GameObject / 3D Object / Cube
* select GameObject / Light / Point Light
* drag&drop the Light onto the Cube in the Hierarchy menu
* delete the Directional Light by selecting it and then select Edit / Delete
* select the Main Camera and set Position to 0, 10, 0 and Rotation to 90, 0, 0

![onecube](01onecube.png?raw=true "onecube")

next we add a script so that the light moves up and down.

* select Point Light in the Hierarchy menu
* in the Inspector window select 'Add Component'
* select 'New Script', call it something (here light) and make sure language is **javascript**
* double click the light script icon under assets and Mono Develop should start
* paste in the following code (replacing what was there)...

```javascript
var speed= 0.1;

function Start () {
}

function Update () {
    transform.localPosition= Vector3(0, Mathf.Sin((Time.frameCount*speed)), 0);
}
```

save, go back to unity and click run. you should see something like this with the light pulsating...

![pulselight](02pulselight.png?raw=true "pulselight")

while it is playing select Point Light in the Hierarchy menu and then change the speed in the Inspector window.

now we want many cubes...

* select the Cube in the Hierarchy menu
* select Edit / Duplicate eight times to make eight copies (of the cube and light)
* select each cube and edit their Position X in the inspector window
* place them one unit apart with four to the left and four to the right
* so the positions would be:

```
Cube       0 0 0
Cube (1)   1 0 0
Cube (2)   2 0 0
Cube (3)   3 0 0
Cube (4)   4 0 0
Cube (5)   -1 0 0
Cube (6)   -2 0 0
Cube (7)   -3 0 0
Cube (8)   -4 0 0
```

your scene should now look something like this...

![rowcubes](03rowcubes.png?raw=true "rowcubes")

press play and try to change the light speed for some of the cubes

now we want even more cubes...

* select GameObject / Create Empty
* drag&drop all the nine cubes onto the GameObject
* select the GameObject
* select Edit / Duplicate eight times to make eight copies (of the row of nine cubes and lights)
* select each gameobject and edit their Position Z in the inspector window
* place them one unit apart with four under and four above
* so the positions would be:

```
GameObject      0 0 0
GameObject (1)  0 0 1
GameObject (2)  0 0 2
GameObject (3)  0 0 3
GameObject (4)  0 0 4
GameObject (5)  0 0 -1
GameObject (6)  0 0 -2
GameObject (7)  0 0 -3
GameObject (8)  0 0 -4
```

your scene should now look something like this...

![gridcubes](04gridcubes.png?raw=true "gridcubes")

again click run and go into each gameobject / cube / light and change the speed.

play around with changing position, scale, rotation for a gameobject or for a single cube.

(obviously we could create all the cubes and lights directory with a script, but here we did it manually for learning)

now go into Mono Develop and start changing the script (keep running in unity). copy the code below, save, change some numbers, save again etc.

```javascript
var speed= 0.1;

function Start () {
}

function Update () {
    var xx= transform.position.x*0.5;
    var yy= transform.position.z*0.5;
    var y= Mathf.Sin(Time.frameCount*speed+xx)*Mathf.Cos(Time.frameCount*speed+yy);
    transform.localPosition= Vector3(0, y-0.1, 0);
}
```

and with the following code you can individualize color, intensity etc...

```javascript
var speed= 0.1;
var lt: Light;

function Start () {
    lt = GetComponent.<Light>();
}

function Update () {
    var xx= transform.position.x*0.5;
    var yy= transform.position.z*0.5;
    var y= Mathf.Sin(Time.frameCount*speed+xx)+Mathf.Cos(Time.frameCount*speed+yy);
    transform.localPosition= Vector3(0, y-0.5, 0);
    lt.intensity= 6;
    lt.range= 1;
    lt.color= Color(xx, 1, yy);
}
```

last select Assets / Import Package / Characters, find the FPSController in Prefabs and drop it onto your scene. run around on the disco floor.

![disco](05disco.png?raw=true "disco")

resources
--

Newbie guide to Unity Javascript - <https://forum.unity3d.com/threads/newbie-guide-to-unity-javascript-long.34015/>
