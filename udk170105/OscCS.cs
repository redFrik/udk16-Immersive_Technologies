using UnityEngine;
using System.Collections;

public class OscCS : MonoBehaviour {
	//public string remoteIp = "194.95.203.102";	//to a single laptop running sc
	public string remoteIp = "194.95.203.255";		//broadcast to all laptops running sc on network
	public int sendToPort = 57120;
	private int listenerPort = 8400;	//unused
	public GameObject camhead;
	public GameObject ctrlleft;
	public GameObject ctrlright;
	private Osc osc;
	~OscCS() {
		if(osc!=null) {
			osc.Cancel();
		}
		osc = null;
		System.GC.Collect();
	}
	void Start () {
		UDPPacketIO udp = GetComponent<UDPPacketIO> ();
		udp.init (remoteIp, sendToPort, listenerPort);
		osc = GetComponent<Osc> ();
		osc.init (udp);
		OscMessage msg = Osc.StringToOscMessage("/startup");
		osc.Send(msg);
	}
	void Update () {
		OscMessage msg;
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
	void OnDisable() {
		OscMessage msg = Osc.StringToOscMessage("/shutdown");
		osc.Send(msg);
		osc.Cancel ();
		osc = null;
	}
}
