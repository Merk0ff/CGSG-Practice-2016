precision mediump float;
uniform sampler2D uSampler;

varying vec2 cord;
uniform vec2 max;

float mandel( void ) {
    vec2 c = cord;
    vec2 z = c;

    for (float i = 0.0; i < 30.0; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if ((z.x * z.x + z.y * z.y) > 2.0 * 2.0)
            return i;
    }
  return 0.0;
}

void main( void ) {
    float n = mandel();
    gl_FragColor = vec4(n / 30.0, 0, n / 36.0, 1);
}

