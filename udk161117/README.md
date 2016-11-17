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

but as we normally only have stereo sound output (2 channels - left and right) from our laptops, we can only hear the first two clicks.
so mix all the clicking sounds down to stereo (panning the 10 sounds left to right) we can wrap the `Impulse` in a `Splay` like this...

```
a= {Splay.ar(Impulse.ar([1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9]))}.play;
a.release;
```

now you should hear all ten clicks. note how they go in and out of sync.

in supercollider you can often write code in a much more compact form. so we can get exactly the same result by writing it like this...

```
a= {Splay.ar(Impulse.ar((1.0, 1.1 .. 1.9)))}.play;
a.release;

(1.0, 1.1 .. 1.9);  //will post the array above
```

the first value (1.0) is the start value, the second (1.1) will decide the step amount, and the third is the ending value.
play around with the numbers and try to build some different arrays.

here are some more examples...

```
(1, 2 .. 99);  //an array of whole numbers 1-99

(1, -2 .. 99);  //this causes and error because with -2 you will never reach 99

(15, 14.25.. 1.5);  //stepping down from 15 to 1.5 in 0.75 decraments

(0.1, 0.361 .. 2.8);
```

now try putting in some of your own arrays into the sound synthesis code. for example...

```
a= {Splay.ar(Impulse.ar((0.1, 0.667 .. 3)))}.play;
a.release;
```

to better differentiate between the click sounds we can instead make them triggers short pitched 'ping' sounds.

```
a= {var arr= (1.0, 1.1 ..1.9); Splay.ar(Ringz.ar(Impulse.ar(arr),400*(arr*2),0.2))}.play;
a.release;
```

again try to add your own arrays.

note the different rhythms your get. numbers like 1, 0.5, 0.3333333, 0.25 will make the click sounds come back in sync at regular intervals. so 1/2, 1/3, 1/4 etc are all giving interesting result, while combinations of more random numbers like 0.41, 1.18 etc will repeat perhaps only every 10 year.

```
a= {var arr= (1/8, (1/8)+(1/16) .. 1.0); Splay.ar(Ringz.ar(Impulse.ar(arr),400*(arr*2),0.2))}.play;
a.release;

//which is exactly the same as...
a= {var arr= (0.125, 0.1876 .. 1.0); Splay.ar(Ringz.ar(Impulse.ar(arr),400*(arr*2),0.2))}.play;
a.release;
```
here is last week's example again but using this technique for triggering the sound grains.

```
b.free; b= Buffer.readChannel(s, "/Users/asdf/Desktop/sounds/a11wlk01-44_1.aiff", channels:[0]);  //here edit path to your soundfile

a= {var arr= (1/16, (1/16)+(1/8) .. 1); Splay.ar(TGrains.ar(1, Impulse.ar(arr), b.bufnum, 1, arr*b.duration*0.75, 0.3))}.play;
a.release;

//we can also use the array for playback rate
a= {var arr= (1/16, (1/16)+(1/8) .. 1); Splay.ar(TGrains.ar(1, Impulse.ar(arr), b.bufnum, arr+0.5, arr*b.duration*0.75, 0.3))}.play;
a.release;
```

two more examples using this technique but with frequencies mapped to scales...

```
a= {var arr= (1, 2 .. 16); Splay.ar(Ringz.ar(Impulse.ar(arr/16).lag(0.005),(64+Scale.major.degrees).midicps,0.8))*0.5}.play;
a.release;

a= {var num= 32, speed= 0.4, arr= (1, 2 .. num); Limiter.ar(Splay.ar(SinOsc.ar((60+Scale.minorPentatonic.degrees).midicps,0,EnvGen.ar(Env.perc(0.01, 0.5), Impulse.ar(arr/num*speed)))))}.play;
a.release;
```

now watch this... <https://vimeo.com/16977985>

unity
--



resources
--

john whitney - [matrix iii](https://www.youtube.com/watch?v=ZrKgyY5aDvA)

gene youngblood - [expanded cinema](http://www.vasulka.org/Kitchen/PDF_ExpandedCinema/book.pdf). see article about john whitney (page 207)
