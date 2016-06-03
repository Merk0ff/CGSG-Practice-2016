precision mediump float;
uniform sampler2D uSampler;

varying vec2 cord;
uniform vec2 max;
uniform float Mtime;
uniform vec4 area;

float mandel( void ) {
    vec2 c = cord;
    vec2 z = c;

    for (float i = 0.0; i < 30.0; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        if ((z.x * z.x  + z.y * z.y) > 2.0 * 2.0)
            return i;
    }
  return 0.0;
}

void main( void ) {
    vec2 xy = area.xz + gl_FragCoord.xy / 500.0 * (area.yw - area.xz);
    vec3 texcolor = texture2D(uSampler,(cord - 8.0) / 3.4).rgb;
    float n = mandel();

    //if (cord.x > xy.x)
    //    texcolor - (0, 0, 0);
    //if (cord.y > xy.y)
    //   texcolor = (0, 0, 0);

    gl_FragColor = vec4(texcolor * n, 1);
}

