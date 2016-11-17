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

some more examples...
```
a= {var arr= (0.1, 0.15 .. 4)/8; Splay.ar(Ringz.ar(Impulse.ar(arr), 800*arr, 0.2))}.play;
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

now watch this... <https://vimeo.com/16977985> to see a visualization of what's going on.

unity
--

* start unity and create a new project
* turn off Y gravity under Edit / Project Settings / Physics (the default is -9.81 which roughly correspond to our earth's gravity)

![zerogravity](02zerogravity.png?raw=true "zerogravity")

* select GameObject / Create Empty
* go to the inspector and add tag "Cube" (click the + and make sure you type Cube with a capital C)
* select add component, new javascript. call it anything
* open the script and add the following code... (replace what is there by default)

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

resources
--

john whitney - [matrix iii](https://www.youtube.com/watch?v=ZrKgyY5aDvA)

gene youngblood - [expanded cinema](http://www.vasulka.org/Kitchen/PDF_ExpandedCinema/book.pdf). see article about john whitney (page 207)
