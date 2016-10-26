introduction and overview
--------------------

* links to previous semesters... <http://redfrik.github.io/udk00-Audiovisual_Programming/>
* and dates + times for this course... <https://github.com/redFrik/udk16-Immersive_Technologies> <-save this page

course software
--

* [SuperCollider](http://supercollider.github.io/download.html)
* [Unity3D](http://unity3d.com)

supercollider
--

* installing
* making sound and getting around
* recreating Boomerang by Richard Serra <https://www.youtube.com/watch?v=8z32JTnRrHc>

```
//to use with headphones and built-in microphone
s.boot;

a= {DelayN.ar(SoundIn.ar, 0.283, 0.283).dup}.play;  //start delayed microphone sound

a.release;  //stop sound

//playing many delays at the same time
a= {DelayN.ar(SoundIn.ar, 0.1, 0.1).dup}.play;
b= {DelayN.ar(SoundIn.ar, 0.25, 0.25).dup}.play;
c= {DelayN.ar(SoundIn.ar, 0.33, 0.33).dup}.play;
d= {DelayN.ar(SoundIn.ar, 0.42, 0.42).dup}.play;
a.release;
b.release;
c.release;
d.release;

//delay and scaling (lower amplitude)
a= {DelayN.ar(SoundIn.ar, 1, 1).dup*1.0}.play;
b= {DelayN.ar(SoundIn.ar, 0.7, 0.7).dup*0.7}.play;
c= {DelayN.ar(SoundIn.ar, 0.5, 0.5).dup*0.4}.play;
d= {DelayN.ar(SoundIn.ar, 0.2, 0.2).dup*0.2}.play;
a.release;
b.release;
c.release;
d.release;

//similar but in one line
a= {CombN.ar(SoundIn.ar, 0.2, 0.2, 4).dup}.play;  //echo - 4 is decaytime in seconds
a.release;

//many echos (compare to particle system below)
a= {CombN.ar(SoundIn.ar, 0.1, 0.1, 4).dup}.play;
b= {CombN.ar(SoundIn.ar, 0.2, 0.2, 5).dup}.play;
c= {CombN.ar(SoundIn.ar, 0.3, 0.3, 6).dup}.play;
d= {CombN.ar(SoundIn.ar, 0.4, 0.4, 7).dup}.play;
a.release;
b.release;
c.release;
d.release;

```

unity3d
--

* installing
* getting around
* creating a simple particle system

unity3d introduction videos: <https://unity3d.com/learn/tutorials/topics/interface-essentials>

examples
--

Ryoji Ikeda: The Transfinite <https://www.youtube.com/watch?v=omDK2Cm2mwo>

Ulf Langheinrich: Hemisphere <http://www.epidemic.net/en/videos/langheinrich/index.html>
