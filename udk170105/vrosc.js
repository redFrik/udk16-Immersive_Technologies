//for use with SteamVR and unity-osc-receiver
//make sure to set the three gameobjects:
//  camhead - "Main Camera (head)"
//  ctrlleft - "Main Camera (head)"
//  ctrlright - "Main Camera (head)"

//osc protocol:
//	/startup
//	/shutdown
//	/camhead posx posy posz rotx roty rotz
//	/ctrlleft posx posy posz rotx roty rotz
//	/ctrlright posx posy posz rotx roty rotz

#pragma strict

public var RemoteIP : String = "194.95.203.102";	//to a single laptop running sc
//public var RemoteIP : String = "194.95.203.255";	//broadcast to all laptops running sc on network
public var SendToPort : int = 57120;
private var ListenerPort : int = 8400;	//unused
public var camhead : GameObject;
public var ctrlleft : GameObject;
public var ctrlright : GameObject;
private var osc : Osc;

function Start() {
	var udp : UDPPacketIO = GetComponent("UDPPacketIO");
	udp.init(RemoteIP, SendToPort, ListenerPort);
	osc = GetComponent("Osc");
	osc.init(udp);
	var msg : OscMessage = Osc.StringToOscMessage("/startup");
	osc.Send(msg);
}
function Update() {
	var msg : OscMessage;
	msg= Osc.StringToOscMessage("/camhead "
		+camhead.transform.position.x+" "
		+camhead.transform.position.y+" "
		+camhead.transform.position.z+" "
		+camhead.transform.rotation.x+" "
		+camhead.transform.rotation.y+" "
		+camhead.transform.rotation.z
	);
	osc.Send(msg);
	msg= Osc.StringToOscMessage("/ctrlleft "
		+ctrlleft.transform.position.x+" "
		+ctrlleft.transform.position.y+" "
		+ctrlleft.transform.position.z+" "
		+ctrlleft.transform.rotation.x+" "
		+ctrlleft.transform.rotation.y+" "
		+ctrlleft.transform.rotation.z
	);
	osc.Send(msg);
	msg= Osc.StringToOscMessage("/ctrlright "
		+ctrlright.transform.position.x+" "
		+ctrlright.transform.position.y+" "
		+ctrlright.transform.position.z+" "
		+ctrlright.transform.rotation.x+" "
		+ctrlright.transform.rotation.y+" "
		+ctrlright.transform.rotation.z
	);
	osc.Send(msg);
}
function OnDisable() {
	var msg : OscMessage = Osc.StringToOscMessage("/shutdown");
	osc.Send(msg);
	osc.Cancel();
	osc = null;
}
