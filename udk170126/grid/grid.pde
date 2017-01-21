//this processing sketch takes webcamera input and send the osc data to unity
import processing.video.*;
import oscP5.*;
import netP5.*;
Capture video;
OscP5 oscP5;
NetAddress unity;

int pwidth= 64;
int pheight= 48;
float scale= -0.2;  //depth
float zoom= 35;     //z pos

void setup() {
  size(256, 192);
  frameRate(30);
  video= new Capture(this, pwidth, pheight);
  video.start();
  oscP5= new OscP5(this, 57120);
  unity= new NetAddress("127.0.0.1", 9876);
  noStroke();
}
void draw() {
  video.loadPixels();
  for(int y= 0; y<pheight; y++) {
    OscMessage msg= new OscMessage("/pixels");
    msg.add(y);
    for(int x= 0; x<pwidth; x++) {
      int col= video.pixels[y*pwidth+x];
      int r= (col>>16)&0xFF;
      int g= (col>>8)&0xFF;
      int b= col&0xFF;
      float lum= (0.3*r)+(0.59*g)+(0.11*b);
      fill(lum);
      rect(x*(width/pwidth), y*(height/pheight), pwidth, pheight);
      msg.add(lum*scale+zoom);
    }
    oscP5.send(msg, unity);
  }
}
void captureEvent(Capture c) {
  c.read();
}