projects
--------------------

kinect
--

NOTE: this was tested on mac osx with kinect v1 (model 1414). you will need a kinect v1 for this to work.

first install openni and nite. see instructions here... <https://github.com/redFrik/udk15-Surveillance_and_Analysis/tree/master/udk160526#advanced-kinect-skeleton>
OSCeleton is not needed here but it might be worth installing too.

then install libfreenect with `brew install libfreenect` and after that you should be able to try the kinect sensor with the command `freenect-glview`. if it works you should see a xquartz window with the depth image from the kinect sensor.

now unity...

* go to <http://zigfu.com/en/downloads/legacy/> and download Unity-OpenNI Bindings v1.4
* create a new unity 3d project
* double click the file UnityOpenNIBindings-v1.4.unitypackage that you downloaded
* now find and try the example '_/Scenes / MeshFromDepth'
* (also the skeleton tracking examples work)

custom example TODO
