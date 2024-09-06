import * as THREE from "../core/build/three.module.js"
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js";

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;
        
        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setCamera();
        this._setLight();
        this._setModel();
        this._setControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setCamera() {
        const width  = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width/height,
            0.1,
            1500
        );
        camera.position.set(1000, 0, 0);
        this._camera = camera;
    }

    _setLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);        

        this._scene.add(new THREE.AmbientLight(color, 0.3));
    }

    _setModel() {
        const partWidth = 50;
        const partHeight = 200;
        //const geometry = new THREE.CylinderGeometry(partWidth*0.65, partWidth, partHeight, 32);
        const geometry = new THREE.BoxGeometry(partWidth, partHeight, partWidth);        

        const color = new THREE.Color("#a04500");
        const material = new THREE.MeshPhongMaterial({color: color}); 
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.matrix.makeTranslation(0, -partHeight/2, 0);
        mesh.matrixAutoUpdate = false;
        this._scene.add(mesh);

        function tree(scene, level, matrix, color) {
            if(level === 0) return;
            const tempMatrix = new THREE.Matrix4();
            const scale = 0.77;
            // 가지1 생성 시작
            const newColor1 = color.clone();
            newColor1.g += 0.7 / levels;
            const material1 = new THREE.MeshPhongMaterial({ color: newColor1 });
            const mesh1 = new THREE.Mesh(geometry, material1);
        
            const newMatrix1 = new THREE.Matrix4();
            newMatrix1
                .multiply(tempMatrix.makeRotationY(Math.PI / 2))
                .multiply(tempMatrix.makeTranslation(partWidth / 2, 0, 0))
                .multiply(tempMatrix.makeRotationZ(-Math.PI / 4))
                .multiply(tempMatrix.makeScale(scale, scale, scale))
                .multiply(tempMatrix.makeTranslation(0, partHeight, 0));
        
            mesh1.matrix.copy(newMatrix1.multiply(matrix));
            mesh1.matrixAutoUpdate = false;
            scene.add(mesh1);
        
            tree(scene, level - 1, newMatrix1, newColor1);
        
            // 가지2 생성 시작
            const newColor2 = color.clone();
            newColor2.g += 0.64 / levels;
            const material2 = new THREE.MeshPhongMaterial({ color: newColor2 });
            const mesh2 = new THREE.Mesh(geometry, material2);
        
            const newMatrix2 = new THREE.Matrix4();
            newMatrix2
                .multiply(tempMatrix.makeRotationY(Math.PI / 2))
                .multiply(tempMatrix.makeTranslation(-partWidth / 2, 0, 0))
                .multiply(tempMatrix.makeRotationZ(Math.PI / 4))
                .multiply(tempMatrix.makeScale(scale, scale, scale))
                .multiply(tempMatrix.makeTranslation(0, partHeight, 0));
            
            mesh2.matrix.copy(newMatrix2.multiply(matrix));
            mesh2.matrixAutoUpdate = false;
            scene.add(mesh2);
            
            tree(scene, level - 1, newMatrix2, newColor2);
        }
        const levels = 12;
        tree(this._scene, levels, mesh.matrix, color);
    }
///////////////////////////////////////////////////////////
    _setControls() {
        new OrbitControls(this._camera, this._divContainer)
    }

    resize() {
        const width  = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time){
        time *= 0.001; // second unitc
        //this._cube.rotation.x = time;
        //this._cube.rotation.y = time;
    }
}

window.onload = function() {
    new App();
}