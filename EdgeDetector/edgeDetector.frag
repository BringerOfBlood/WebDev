#ifdef GL_ES
precision mediump float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;
uniform float dx;
uniform float dy;

float threshold = 0.01;

float mean3(vec4 img) {
    // transform colors to gray scale
    return 1.0/3.0*(img.x + img.y + img.z);
}

float square(float x) {
    return x*x;
}

void main() {
    vec2 uv = vTexCoord;
    // the texture is loaded upside down and backwards by default so lets flip it
    uv.y = 1.0 - uv.y;
    uv.x = 1.0 - uv.x;

    // Getting pixel color from current coordinate uv
    vec4 tex = texture2D(tex0, uv);
    // transform colors to gray scale
    float mean = mean3(tex);

    // Getting the right neighbor
    vec4 tex_pdx = texture2D(tex0, uv+vec2(dx,0.0));
    // transform colors to gray scale
    float mean_pdx = mean3(tex_pdx);

    // Getting the upper neighbor
    vec4 tex_pdy = texture2D(tex0, uv+vec2(0.0,dy));
    // transform colors to gray scale
    float mean_pdy = mean3(tex_pdy);

    /*
    // compute gradients and absolute values
    // add vertical and horizontal gradients
    float value = abs(mean-mean_pdx) + abs(mean-mean_pdy);


    float cl = 0.0;

    if (abs(mean-mean_pdx)>threshold || abs(mean-mean_pdy)>threshold) {
        cl = 1.0;
    }
    vec4 color = vec4(vec3(1.0-cl), 1.0);*/
    vec4 color = vec4(vec3(square(mean-mean_pdx) + square(mean-mean_pdy))*50.0,1.0);
    gl_FragColor = color;
}