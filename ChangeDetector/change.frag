#ifdef GL_ES
precision lowp float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D u_avg;
uniform sampler2D u_img;

float square(float x) {
    return x * x;
}
void main() {
    // image coordinate
    vec2 uv = vTexCoord;
    // the texture is loaded upside down and backwards by default so lets flip it

    uv.y = 1.0 - uv.y;
    vec4 avg = texture2D(u_avg, uv);

    uv.x = 1.0 - uv.x;
    vec4 img = texture2D(u_img, uv);

    vec4 color = vec4(0.0);

    float change = (square(avg.x - img.x) + square(avg.y - img.y) + square(avg.z - img.z)) / 3.0;
    //vec4 gray = vec4((img.x + img.y + img.z)/3.0);
    //color= change*img + (1.0-change)*gray;
    if (change>0.02) {
        color = 1.0 - (1.0-img)*(1.0-img);
    } else {
        color = 0.5*img;
    }

    color.a = 1.0;
    gl_FragColor = color;
}