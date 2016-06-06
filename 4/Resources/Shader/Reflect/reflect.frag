uniform samplerCube cubemap;

varying vec2 vUv;
varying vec3 reflectDir;

void main( void )
{
  vec4 color = vec4(textureCube(cubemap, reflectDir));
  gl_FragColor = vec4( vec3( vUv, 0.0 ), 1.0);
  gl_FragColor=clamp(color, 0.0, 1.0);
}