#ifdef GL_ES
precision lowp float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;

float square(float x) {
    return x*x;
}

void main() {
    vec2 uv = vTexCoord;
    // the texture is loaded upside down and backwards by default so lets flip it
    uv.y = 1.0 - uv.y;
    uv.x = 1.0 - uv.x;

    // Getting pixel color from current coordinate uv
    vec4 color = texture2D(tex0, uv);

    gl_FragColor = color;
}