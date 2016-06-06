/**
 * Created by pd6 on 04.06.2016.
 */

var scene;
var camera;
var renderer;
var geometrySphere, geometryCube;
var materialSphere, materialCube;
var sphere, cube;
var WindowW, WindowH;
var controls;
var stats, container;
var CubeMapTex, cubeCamera, cubeCamera2;
var SkyBox;


function tick() {
    window.requestAnimationFrame(tick);

    if (WindowW != window.innerWidth || WindowH != window.innerHeight) {
        WindowW = window.innerWidth;
        WindowH = window.innerHeight;
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(WindowW, WindowH);
    }
    controls.update();
    Render();
}

function Render() {
    var time = Date.now();

    sphere.visible = false;
    cubeCamera.position.copy(sphere.position);
    cubeCamera.updateCubeMap(renderer, scene);
    sphere.visible = true;

    cube.position.x = Math.cos(time * 0.0007) * 7;
    cube.position.y = Math.sin(time * 0.0007) * 7;
    cube.position.z = Math.sin(time * 0.0007) * 7;

    cube.visible = false;
    cubeCamera2.position.copy(cube.position);
    cubeCamera2.updateCubeMap(renderer, scene);
    cube.visible = true;

    renderer.render(scene, camera);
    stats.update();
}


function CreateSkyBox() {
    InitCubeTexture('Resources/Textures/SkyBox/');

    var shader = THREE.ShaderLib['cube'];
    shader.uniforms['tCube'].value = CubeMapTex;

    var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: shader.fragmentShader,
        vertexShader: shader.vertexShader,
        uniforms: shader.uniforms,
        depthWrite: false,
        side: THREE.DoubleSide
    });

    SkyBox = new THREE.Mesh(
        new THREE.CubeGeometry(1000, 1000, 1000),
        skyBoxMaterial
    );

    cubeCamera = new THREE.CubeCamera(1, 100000, 512);
    cubeCamera2 = new THREE.CubeCamera(1, 100000, 512);
}

function StartGr() {
    InitRender();
    InitCamera();
    InitGeometru();

    CreateSkyBox();

    InitMaterial();
    InitObjects();
    InitScene();
    InitStats();

    //LoadModel('Resources/CESSNA/', ' Cessna_172');
    InitControl();
    Render();
    tick();
}


