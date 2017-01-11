projects
--------------------

midi input
--

for unity to take midi input from another program or from a hardware midicontroller do the following...

* go to <https://github.com/keijiro/MidiJack> and click the green download button
* get the zip file and uncompress it
* in unity select 'Assets / Import Package / Custom Package...'
* import the file 'MidiJack.unitypackage'
* select 'GameObject / 3D Object / Cube' to make a new cube
* select 'Add Component / New Script'
* call it something (here 'mymidi'), make sure language is C sharp and click 'Create and Add'
* double click the script to open it in MonoDevelop
* paste in the code below replacing what was there
* connect midi device and run

```
using UnityEngine;
using MidiJack;

public class mymidi : MonoBehaviour {
    void Update() {
        var k1= MidiMaster.GetKnob(2);	//edit to match your CC - here nanokontrol
        var k2= MidiMaster.GetKnob(3);
        var k3= MidiMaster.GetKnob(4);
        var k4= MidiMaster.GetKnob(5);
        var k5= MidiMaster.GetKnob(6);
        var k6= MidiMaster.GetKnob(8);
        transform.localScale= new Vector3(k1, k2, k3);
        transform.localPosition= new Vector3(k4, k5, k6);
    }
}
```

now you should be able to move the cube around with the first six sliders on a korg nanokontrol (adapt GetKnob to match your midi device)

routing sound
--

https://github.com/mattingalls/Soundflower/releases get the 2.0b2
