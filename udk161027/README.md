introduction and overview
--------------------

* links to previous semesters... <http://redfrik.github.io/udk00-Audiovisual_Programming/>
* and dates + times for this course... <https://github.com/redFrik/udk16-Immersive_Technologies> <-save this page

discussion
--

Immersive audiovisual works?

big screen, loud sound, huge room

vs

glasses, headphones, private space

examples
--

Ryoji Ikeda: The Transfinite <https://www.youtube.com/watch?v=omDK2Cm2mwo>

Ulf Langheinrich: Hemisphere <http://www.epidemic.net/en/videos/langheinrich/index.html>

flight simulators: <https://www.youtube.com/watch?v=w5Psonmh0GQ>

computer games

other artists mentioned:

Herman Kolgen <http://www.kolgen.net> canadian

Darsha Hewitt <http://www.darsha.org> installation at stattbad wedding

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

1+40.rand;

(degree:1+40.rand).play;

a= {DelayN.ar(SoundIn.ar, 0.283, 0.283).dup}.play;  //start delayed microphone sound
//now talk freely into the mic and play with the headphone volume
//at some point you should feel your speech become slower and slower
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

//doppler effect
a= {DelayC.ar(SoundIn.ar, 2, MouseX.kr(0, 2)).dup}.play;
//move mouse slowloy left to right to transpose down
//move mouse slowloy right to left to transpose up
a.release;

a= {DelayC.ar(SoundIn.ar, 2, MouseX.kr(0, 2)).dup}.play;
b= {DelayC.ar(SoundIn.ar, 3, MouseX.kr(0, 3)).dup}.play;
c= {DelayC.ar(SoundIn.ar, 4, MouseX.kr(0, 4)).dup}.play;
d= {DelayC.ar(SoundIn.ar, 5, MouseX.kr(0, 5)).dup}.play;
e= {DelayC.ar(SoundIn.ar, 6, MouseX.kr(0, 6)).dup}.play;
a.release;
b.release;
c.release;
d.release;
e.release;
```

unity3d
--

* installing
* getting around
* access documentation (little book icon)
* creating a simple particle system
* exporting to standalone application / webpage

install with 'webgl build support' so that we can export our creations as webpages. if you want to add webgl support later you can do that under file/buildsettings.

![unity_install_webgl](unity_install_webgl.png?raw=true "unity_install_webgl")

unity3d introduction videos: <https://unity3d.com/learn/tutorials/topics/interface-essentials>

* scene vs game view
* camera
* coordinate system
* position, rotation, scale
* hierarchy
