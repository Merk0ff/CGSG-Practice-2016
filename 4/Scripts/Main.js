/**
 * Created by pd6 on 04.06.2016.
 */

var scene;
var camera;
var renderer;
var geometry;
var material;
var cube;
var WindowW, WindowH;


function tick() {
    window.requestAnimationFrame(tick);
    Render();
}

function Render() {
    if (WindowW != window.innerWidth || WindowH != window.innerHeight) {
        WindowW = window.innerWidth;
        WindowH = window.innerHeight;
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize(WindowW, WindowH);
    }

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
};

function InitScene() {
    scene = new THREE.Scene();
    scene.add(cube);
}

function InitCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
}

function InitMaterial() {
    material = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
}

function InitGeometru() {
    geometry = new THREE.SphereGeometry(1, 100);
}

function InitRender() {
    renderer = new THREE.WebGLRenderer();
    document.body.appendChild(renderer.domElement);
    WindowW = window.innerWidth;
    WindowH = window.innerHeight;
    renderer.setSize(WindowW, WindowH);
}

function InitObjects() {
    cube = new THREE.Mesh(geometry, material);
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


