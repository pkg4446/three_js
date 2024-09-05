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
        this._setModle();
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
            100
        );
        camera.position.set(0, 20, 20);
        this._camera = camera;
    }

    _setLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }

    _createTable() {
        const position = {x:0,  y: -0.525,  z:0};
        const scale    = {x:30, y:0.5,      z:30};

        const tableGeometry = new THREE.BoxGeometry();
        const tableMaterial = new THREE.MeshPhongMaterial({color: 0x878787});
        const table = new THREE.Mesh(tableGeometry, tableMaterial);

        table.position.set(position.x, position.y, position.z);
        table.scale.set(scale.x, scale.y, scale.z);

        table.receiveShadow = true;
        this._scene.add(table);
    }

    _createDomino() {
        const controlPoints = [
            [-10., 0., -10.],
            [ 10., 0., -10.],
            [ 10., 0.,  10.],
            [-10., 0., 10.],
            [-10., 0., -8.],
            [8., 0., -8.],
            [8., 0., 8.],
            [-8., 0., 8.], 
            [-8., 0., -6.],
            [6., 0., -6.],
            [6., 0., 6.],
            [-6., 0., 6.],
            [-6., 0., -4.],
            [4., 0., -4.], 
            [4., 0., 4.],
            [-4., 0., 4.], 
            [-4., 0., -2.], 
            [2., 0., -2.],
            [2., 0., 2.],
            [-2., 0., 2.],
            [-2., 0., 0.],
            [0., 0., 0.],
        ];

        const p0 = new THREE.Vector3();
        const p1 = new THREE.Vector3();
        const curve = new THREE.CatmullRomCurve3(
            controlPoints.map((p, ndx) => {
                if(ndx === controlPoints.length-1) return p0.set(...p);
                p0.set(...p);
                p1.set(...controlPoints[(ndx + 1) % controlPoints.length]);
                return [
                    (new THREE.Vector3()).copy(p0),
                    (new THREE.Vector3()).lerpVectors(p0, p1, 0.3),
                    (new THREE.Vector3()).lerpVectors(p0, p1, 0.7),
                ];
            }).flat(), false
        );

        const points = curve.getPoints(1000);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({color: 0xffff00});
        const curveObject = new THREE.Line(geometry, material);
        this._scene.add(curveObject);

        
    }

    _setModle() {
        this._createTable();
        this._createDomino();
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