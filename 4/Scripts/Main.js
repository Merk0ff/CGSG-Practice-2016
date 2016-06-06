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
var controls;
var stats, container;


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
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
    stats.update();
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
    InitStats();

    LoadModel('Resources/CESSNA/', ' Cessna_172');
    InitControl();
    Render();
    controls.update();
    tick();
}


