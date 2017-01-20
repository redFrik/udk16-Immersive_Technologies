projects
--------------------

grid
--

TODO - not finished

```javascript
#pragma strict

public var RemoteIP : String = "127.0.0.1";
public var SendToPort : int = 57120;	//unused
public var ListenerPort : int = 9876;
private var osc : Osc;
var width= 64;
var height= 48;
private var pixels : float[];
private var balls : GameObject[];
private var changed= false;

function Start() {
    var udp : UDPPacketIO = GetComponent("UDPPacketIO");
    udp.init(RemoteIP, SendToPort, ListenerPort);
    osc = GetComponent("Osc");
    osc.init(udp);
    osc.SetAllMessageHandler(AllMessageHandler);
    pixels= new float[width*height];
    balls= new GameObject[width*height];
    for(var i= 0; i<width*height; i++) {
        var ball= GameObject.CreatePrimitive(PrimitiveType.Sphere);
        var x= i%width;
        var y= i/width;
        ball.transform.localPosition= Vector3(x-(width/2), y-(height/2), 35);  //default value
        balls[i]= ball;
        pixels[i]= 35;	//default value
    }
}
function Update() {
    if(changed) {
        for(var i= 0; i<width*height; i++) {
            balls[i].transform.localPosition.z= pixels[i];
        }
        changed= false;
    }
}
public function AllMessageHandler(oscMessage: OscMessage) {
    var msgAddress = oscMessage.Address;
    var msgValue = oscMessage.Values;
    if(msgAddress=="/pixels") {
        var y : int = msgValue[0];	//first value is row index (0-47)
        for(var x= 0; x<width; x++) {
            pixels[y*width+x]= msgValue[x+1];
        }
        changed= true;
    }
}
```
