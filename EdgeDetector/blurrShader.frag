#ifdef GL_ES
precision mediump float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform float dx;
uniform float dy;


float fltr[5];



void main() {
    fltr[0] = 1.0;
    fltr[1] = 4.0;
    fltr[2] = 6.0;
    fltr[3] = 4.0;
    fltr[4] = 1.0;

    vec2 uv = vTexCoord;
    // the texture is loaded upside down and backwards by default so lets flip it
    uv.y = 1.0 - uv.y;
    uv.x = 1.0 - uv.x;

    vec4 sum = vec4(0.0);
    float count = 0.0;
    float weight;
    for (int i=-2; i<3; i++){
        for (int j=-2; j<3; j++){
            weight = fltr[i]*fltr[j];
            sum += weight*texture2D(tex0, uv+vec2(float(i)*dx,float(j)*dy));
            count += weight;
        }
    }

    vec4 color = sum/count;
    gl_FragColor = color;
}