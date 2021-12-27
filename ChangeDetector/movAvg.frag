#ifdef GL_ES
precision lowp float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D u_buffer;
uniform sampler2D u_img;

float adaption_rate = 0.002;

float median_estimate(float img, float bffr) {
    float diff = img - bffr;
    if (diff>0.0) {
        return bffr + adaption_rate;
    } else {
        return bffr - adaption_rate;
    }
}

void main() {
    // image coordinate
    vec2 uv = vTexCoord;
    // the texture is loaded upside down and backwards by default so lets flip it
    uv.y = 1.0 - uv.y;
    uv.x = 1.0 - uv.x;

    vec4 img = texture2D(u_img, uv);
    vec4 bffr = texture2D(u_buffer, uv);

    vec4 color = vec4(1.0);

    color.x = median_estimate(img.x, bffr.x);
    color.y = median_estimate(img.y, bffr.y);
    color.z = median_estimate(img.z, bffr.z);

    //vec4 color = 0.1*img + 0.9*bffr;
    //color.a = 1.0;
    gl_FragColor = color;
}