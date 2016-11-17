whitney
--------------------

john whitney - digital harmony, on the complementarity of music and visual art (1980)

jim bumgardner - [whitney music box](http://krazydad.com/blog/2006/04/23/visual-harmony/)

memo atkin - [simple harmonic motion](http://www.memo.tv/simple-harmonic-motion/)

supercollider
--

playing around with rhythms...

```
s.options.numOutputBusChannels= 16; //make sure supercollider uses 16 outputs
s.reboot;   //start (or restart) the sound server
s.meter;    //open level meter window

a= {Impulse.ar([1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9])}.play;
a.release;  //stop
```

the above code should give you something like this...

![meters](01meters.png?raw=true "meters")

study the pattern.

as we normally only have stereo sound output (2 channels - left and right) from our laptops, we can only hear the first two clicks.
in supercollider we can mix all the clicking sounds down to stereo (here panning the 10 sounds left to right) by wrapping the `Impulse` in a `Splay` like this...

```
a= {Splay.ar(Impulse.ar([1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9]))}.play;
a.release;
```

now you should hear all ten clicks. note how they go in and out of sync.

in programming you often want to write code in a more compact form. so we can get exactly the same result by writing like this...

```
a= {Splay.ar(Impulse.ar((1.0, 1.1 .. 1.9)))}.play;
a.release;

(1.0, 1.1 .. 1.9);  //will post the array above
```

the code `(start, next .. last);` creates an array for us so that we don't manually need to type in all the numbers.

the first value (1.0) is the start value, the second (1.1) will decide the step amount, and the third is the ending value.
play around with the numbers and try to build some different arrays.

here are some more examples...

```
(1, 2 .. 99);  //an array of whole numbers 1-99

(1, -2 .. 99);  //this causes and error because with -2 you will never reach 99

(15, 14.25.. 1.5);  //stepping down from 15 to 1.5 in 0.75 decraments

(0.1, 0.361 .. 2.8);
```
note that there's a drawback with this because it's not so easy to spontaneously adjust one of the values in the middle. but on the other hand it's easy to quickly create large arrays when you don't have to write it all out manually.

now try putting in some of your own arrays into the sound synthesis code. for example...

```
a= {Splay.ar(Impulse.ar((0.1, 0.667 .. 3)))}.play;
a.release;
```

to better differentiate between the click sounds we can instead make them triggers short pitched 'ping' sounds.

```
a= {var arr= (1.0, 1.1 ..1.9); Splay.ar(Ringz.ar(Impulse.ar(arr), 800*arr, 0.2))}.play;
a.release;
```

again try to add your own arrays.

note the different rhythms your get. numbers like 1, 0.5, 0.3333333, 0.25 will make the click sounds come back in sync at regular intervals. so 1/2, 1/3, 1/4 etc are all giving interesting result, while combinations of more random numbers like 0.41, 1.18 etc will repeat perhaps only every 10 year.

```
a= {var arr= (1/8, (1/8)+(1/16) .. 1.0); Splay.ar(Ringz.ar(Impulse.ar(arr), 800*arr, 0.2))}.play;
a.release;

//which is exactly the same as...
a= {var arr= (0.125, 0.1876 .. 1.0); Splay.ar(Ringz.ar(Impulse.ar(arr), 800*arr, 0.2))}.play;
a.release;
```

here is last week's example again but using this technique for triggering the sound grains.

```
b.free; b= Buffer.readChannel(s, "/Users/asdf/Desktop/sounds/a11wlk01-44_1.aiff", channels:[0]);  //here edit path to your soundfile

a= {var arr= (1/16, (1/16)+(1/8) .. 1); Splay.ar(TGrains.ar(1, Impulse.ar(arr), b.bufnum, 1, arr*b.duration*0.75, 0.5))}.play;
a.release;

//we can also use the array for playback rate
a= {var arr= (1/16, (1/16)+(1/8) .. 1); Splay.ar(TGrains.ar(1, Impulse.ar(arr), b.bufnum, arr+0.5, arr*b.duration*0.75, 0.5))}.play;
a.release;
```

two more examples using this technique but with frequencies mapped to scales...

```
a= {var arr= (1, 2 .. 16); Splay.ar(Ringz.ar(Impulse.ar(arr/16).lag(0.005), (64+Scale.major.degrees).midicps, 0.8))*0.5}.play;
a.release;

a= {var num= 32, speed= 0.4, arr= (1, 2 .. num); Limiter.ar(Splay.ar(SinOsc.ar((60+Scale.minorPentatonic.degrees).midicps, 0, EnvGen.ar(Env.perc(0.01, 0.5), Impulse.ar(arr/num*speed)))))}.play;
a.release;
```

some more examples...

```
//79 pings
a= {var arr= (0.1, 0.15 .. 4)/8; Splay.ar(Ringz.ar(Impulse.ar(arr), 800*arr, 0.2))}.play;
a.release;

//use a scale to pitch buffer sample playback
a= {var arr= (1/16, (1/16)+(1/8) .. 1); Splay.ar(TGrains.ar(1, Impulse.ar(arr), b.bufnum, Scale.minorPentatonic.degrees.midiratio, 0, 0.5))}.play;
a.release;
```

now watch this... <https://vimeo.com/16977985> to see a visualization of what's going on.

unity
--

* start unity and create a new project
* turn off Y gravity under Edit / Project Settings / Physics (the default is -9.81 which roughly correspond to gravity here on our earth)

![zerogravity](02zerogravity.png?raw=true "zerogravity")

* select GameObject / Create Empty
* go to the inspector and add tag "Cube" (click the + and make sure you type Cube with a capital C)
* select add component, new javascript. call it anything
* open the script and copy&paste the code here below (replace what is there by default)
* save, go back to unity and press play

```javascript
var stepX= 1.2;
var speed= 0.05;
var offset= 0.2;

function Start() {
    var num= 10;	//how many objects
    for (var i= 0; i<num; i++) {
        var cube= GameObject.CreatePrimitive(PrimitiveType.Cube);	//here try different primitives
        cube.tag= "Cube";
        cube.AddComponent.<Rigidbody>();
    }
}
function Update() {
    var cubes : GameObject[];
    cubes= GameObject.FindGameObjectsWithTag("Cube");
    for(var i= 0; i<cubes.length; i++) {
        cubes[i].transform.position= Vector3(i*stepX, Mathf.Sin((Time.frameCount*speed)+(i*offset)), 0);
    }
}

//some primitives to try
//PrimitiveType.Plane
//PrimitiveType.Cube
//PrimitiveType.Sphere
//PrimitiveType.Capsule
//PrimitiveType.Cylinder
```

play around with the camera and also try changing things in the code. with 100 objects of type `Sphere` and with some fiddling around with the varables, you can get something like this snake...

![snake](03snake.png?raw=true "snake")

we can also add an amplitude variable. and another importaint feature to add is that the speed of each object should be tied to the index. so the first object (when `i= 0` in the for loop) should move slow, the next object a little bit faster and so on. it's easy to do with a `*(i+1)*timeFactor` - see the code below.

* copy&paste the code below into your javascript in MonoDevelop, replacing what was there
* save and go back to unity
* (if you're still in run mode) after a second or two the scene should change automatically

```javascript
var stepX= 1.2;
var speed= 0.005;
var offset= 0.2;
var amp= 1.5;   //scale the wave
var timeFactor= 0.1;

function Start() {
    var num= 100;    //how many objects
    for (var i= 0; i<num; i++) {
        var cube= GameObject.CreatePrimitive(PrimitiveType.Sphere);   //here try different primitives
        cube.tag= "Cube";
        cube.AddComponent.<Rigidbody>();
    }
}
function Update() {
    var cubes : GameObject[];
    cubes= GameObject.FindGameObjectsWithTag("Cube");
    for(var i= 0; i<cubes.length; i++) {
        cubes[i].transform.position= Vector3(i*stepX, Mathf.Sin((Time.frameCount*speed*(i+1)*timeFactor)+(i*offset))*amp, 0);
    }
}
```

now we add a cosine for the x axis to get a spiral. and we also clean up the code a little bit by adding more variables (x, y, theta)...

```javascript
var speed= 0.005;
var offset= 0.2;
var amp= 0.1;   //scale the wave
var timeFactor= 0.1;

function Start() {
    var num= 100;    //how many objects
    for (var i= 0; i<num; i++) {
        var cube= GameObject.CreatePrimitive(PrimitiveType.Sphere);   //here try different primitives
        cube.tag= "Cube";
        cube.AddComponent.<Rigidbody>();
    }
}
function Update() {
    var cubes : GameObject[];
    cubes= GameObject.FindGameObjectsWithTag("Cube");
    for(var i= 0; i<cubes.length; i++) {
        var iamp= amp*(i+1);
        var theta= (Time.frameCount*speed*(i+1)*timeFactor)+(i*offset);
        var x= Mathf.Cos(theta)*iamp;
        var y= Mathf.Sin(theta)*iamp;
        cubes[i].transform.position= Vector3(x, y, 0);
    }
}
```

![spiral](04spiral.png?raw=true "spiral")

last we add a sine function for the z axis as well. zoom out the main camera a bit and you should see a complex structure spiraling around in three dimensions.

```javascript
var speed= 0.005;
var offset= 0.2;
var amp= 0.1;   //scale the wave
var timeFactor= 0.1;
var zfactor= 0.3;

function Start() {
    var num= 100;    //how many objects
    for (var i= 0; i<num; i++) {
        var cube= GameObject.CreatePrimitive(PrimitiveType.Sphere);   //here try different primitives
        cube.tag= "Cube";
        cube.AddComponent.<Rigidbody>();
    }
}
function Update() {
    var cubes : GameObject[];
    cubes= GameObject.FindGameObjectsWithTag("Cube");
    for(var i= 0; i<cubes.length; i++) {
        var iamp= amp*(i+1);
        var theta= (Time.frameCount*speed*(i+1)*timeFactor)+(i*offset);
        var x= Mathf.Cos(theta)*iamp;
        var y= Mathf.Sin(theta)*iamp;
        var z= Mathf.Sin(theta*zfactor)*iamp;
        cubes[i].transform.position= Vector3(x, y, z);
    }
}
```

you can also add a texture by...

* drag&drop a picture file into assets
* create a folder (left or control click) and name it Resources
* move your picture file into the resources folder (see screenshot below)
* then take this code and edit the filename to match your file...

```javascript
var speed= 0.005;
var offset= 0.2;
var amp= 0.1;   //scale the wave
var timeFactor= 0.1;
var zfactor= 0.3;

function Start() {
    var num= 100;    //how many objects
    var tex = Resources.Load("Immersive_Technologies") as Texture;	//here edit to match your filename
    print(tex); //null if not found
    for (var i= 0; i<num; i++) {
        var cube= GameObject.CreatePrimitive(PrimitiveType.Sphere);   //here try different primitives
        cube.tag= "Cube";
        cube.AddComponent.<Rigidbody>();
        cube.GetComponent.<Renderer>().material.mainTexture= tex;
    }
}
function Update() {
    var cubes : GameObject[];
    cubes= GameObject.FindGameObjectsWithTag("Cube");
    for(var i= 0; i<cubes.length; i++) {
        var iamp= amp*(i+1);
        var theta= (Time.frameCount*speed*(i+1)*timeFactor)+(i*offset);
        var x= Mathf.Cos(theta)*iamp;
        var y= Mathf.Sin(theta)*iamp;
        var z= Mathf.Sin(theta*zfactor)*iamp;
        cubes[i].transform.position= Vector3(x, y, z);
    }
}
```

![texture](06texture.png?raw=true "texture")

resources
--

john whitney - [matrix iii](https://www.youtube.com/watch?v=ZrKgyY5aDvA)

gene youngblood - [expanded cinema](http://www.vasulka.org/Kitchen/PDF_ExpandedCinema/book.pdf). see article about john whitney (page 207)
