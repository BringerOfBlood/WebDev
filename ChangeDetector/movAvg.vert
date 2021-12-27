#ifdef GL_ES
precision mediump float;
#endif


// our vertex data
attribute vec3 aPosition;
attribute vec2 aTexCoord;

// lets get texcoords just for fun!
varying vec2 vTexCoord;

void main() {
    // pass coordinate to frag shader
    vTexCoord = aTexCoord;

    // correct position
    vec4 pos = vec4(aPosition, 1.0);
    pos.xy = pos.xy * 2.0 - 1.0;
    // return position
    gl_Position = pos;
}