/**
 * Created by pd6 on 06.06.2016.
 */

function InitScene() {
    scene = new THREE.Scene();
    scene.add(cube);
    scene.add(plane);
}

function InitStats() {
    container = document.getElementById('body');
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);
}

function InitCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
}

function InitMaterial() {
    materialSphere = new THREE.MeshBasicMaterial({color: 0x00ff00, wireframe: true});
    materialPlane = new THREE.MeshBasicMaterial({color: 0x0000ff});
}

function InitGeometru() {
    geometrySphere = new THREE.SphereGeometry(1, 100);
    geometryPlane = new THREE.PlaneGeometry(5, 20, 32);
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

function InitControl() {
    controls = new THREE.TrackballControls(camera);
    controls.target.set(0, 0, 0)
    controls.rotateSpeed = 2.0;
    controls.zoomSpeed = 2.2;
    controls.panSpeed = 1.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.keys = [65, 83, 68];

    controls.addEventListener('change', Render);

}