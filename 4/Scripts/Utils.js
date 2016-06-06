/**
 * Created by pd6 on 06.06.2016.
 */

function OpenFile(FileName) {
    var str = "";
    var xhr = new XMLHttpRequest();
    xhr.open('GET', FileName, false);
    xhr.send();
    str = xhr.responseText;
    return str;
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
