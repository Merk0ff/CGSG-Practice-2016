/**
 * Created by pd6 on 04.06.2016.
 */

var scene;
var camera;
var renderer;
var geometrySphere, geometryPlane;
var materialSphere, materialPlane;
var cube, plane;
var WindowW, WindowH;


function tick() {
    var vec = new THREE.Vector3(0, 0, 0);
    var clock = new THREE.Clock;

    window.requestAnimationFrame(tick);

    if (WindowW != window.innerWidth || WindowH != window.innerHeight) {
        WindowW = window.innerWidth;
        WindowH = window.innerHeight;
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(WindowW, WindowH);
    }

    //camera.position.x = Math.sin(clock.getElapsedTime) ;
    //camera.position.z = Math.cos(clock.getElapsedTime) ;
    //camera.lookAt = vec;

    Render();
}

function Render() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};

function InitScene() {
    scene = new THREE.Scene();
    scene.add(cube);
    scene.add(plane);
}

function InitCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.x = 5;
    camera.rotation.x = 1;
    camera.rotation.y = 1;
}

function InitMaterial() {
    materialSphere = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
    materialPlane = new THREE.MeshBasicMaterial({color: 0x0000ff});
}

function InitGeometru() {
    geometrySphere = new THREE.SphereGeometry(1, 100);
    geometryPlane = new THREE.PlaneGeometry(5, 20, 32 );
}

function InitRender() {
    renderer = new THREE.WebGLRenderer();
    document.body.appendChild(renderer.domElement);
    WindowW = window.innerWidth;
    WindowH = window.innerHeight;
    renderer.setSize(WindowW, WindowH);
}

function InitObjects() {
    cube = new THREE.Mesh(geometrySphere, materialSphere);
    plane = new THREE.Mesh(geometryPlane, materialPlane);
}

function LoadModel(path, name) {
    var Vec = new THREE.Vector3(0, 1, 0);
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath(path);
    mtlLoader.load(name + '.mtl', function (materials) {
        materials.preload();
        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(path);
        objLoader.load(name + '.obj',
            function (object) {
                scene.add(object);
            });
    });

}

function StartGr() {
    InitRender();
    InitCamera();
    InitGeometru();
    InitMaterial();
    InitObjects();
    InitScene();
    LoadModel('Resources/CESSNA/', ' Cessna_172');
    Render();
    tick();
}


