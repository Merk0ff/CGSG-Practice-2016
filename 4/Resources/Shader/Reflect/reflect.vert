uniform vec3 camPos;

varying vec2 vUv;
varying vec3 reflectDir;

void main( void )
{
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

  vec3 normalDirection = normalize(vec3(vec4(normal, 0.0) * modelMatrix));

  vec3 viewDirection = vec3(modelMatrix * vec4(position, 1.0) - vec4(camPos, 1.0));
  reflectDir = reflect(viewDirection, normalize(normalDirection));
}