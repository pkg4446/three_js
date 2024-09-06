import * as THREE from "../core/build/three.module.js";
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js";
import { FontLoader } from "../core/jsm/loaders/FontLoader.js";
import { TextGeometry } from "../core/jsm/geometries/TextGeometry.js";

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
            100
        );
        camera.position.x = 10;
        camera.position.y = 10;
        camera.position.z = 10;
        this._camera = camera;
    }

    _setLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1,2,4);
        this._scene.add(light);
    }
/*
    _setModel() {
        //const geometry = new THREE.BoxGeometry(1,1,1,2,2,2);
        //const geometry = new THREE.CircleGeometry(1, 16, Math.PI/2, Math.PI);
        //const geometry = new THREE.ConeGeometry(0.5, 1, 16, 2, true, Math.PI/2, Math.PI);
        //const geometry = new THREE.CylinderGeometry(1, 0.5, 1, 16, 2, true,Math.PI/2, Math.PI);
        //const geometry = new THREE.SphereGeometry(0.5, 16, 8, Math.PI/2, Math.PI,  0, Math.PI/2);
        //const geometry = new THREE.RingGeometry(0.5, 1, 16, 2, Math.PI/2, Math.PI);
        //const geometry = new THREE.PlaneGeometry(1, 1, 2, 2);
        //const geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 16, Math.PI);
        //const geometry = new THREE.TorusKnotGeometry(0.5, 0.1, 16, 8, 3, 4);
                
        const fillMaterial = new THREE.MeshPhongMaterial({color:0xDDDDDD});
        const cube = new THREE.Mesh(geometry,fillMaterial);

        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry),lineMaterial);

        const group = new THREE.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._model = group;
    }
*/
/*
    _setModel() {
        const shape = new THREE.Shape();
        
        shape.moveTo( 1,  1);
        shape.lineTo( 1, -1);
        shape.lineTo(-1, -1);
        shape.lineTo(-1,  1);
        shape.closePath();

        const x=-2.5, y=-5;
        shape.moveTo(x+2.5, y+2.5);
        shape.bezierCurveTo(x+2.5, y+2.5, x+2,   y,     x,     y);
        shape.bezierCurveTo(x-3,   y,     x-3,   y+3.5, x-3,   y+3.5);
        shape.bezierCurveTo(x-3,   y+5.5, x-1.5, y+7.7, x+2.5, y+9.5);
        shape.bezierCurveTo(x+6,   y+7.7, x+8,   y+4.5, x+8,   y+3.5);
        shape.bezierCurveTo(x+8,   y+3.5, x+8,   y,     x+5,   y);
        shape.bezierCurveTo(x+3.5, y,     x+2.5, y+2.5, x+2.5, y+2.5);

        const points    = shape.getPoints();
        const geometry  = new THREE.BufferGeometry();
        geometry.setFromPoints(points);
   
        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry),lineMaterial);

        this._scene.add(line);
    }
*/
/*
    _setModel() {
        const shape = new THREE.Shape();
        
        const x=-2.5, y=-5;
        shape.moveTo(x+2.5, y+2.5);
        shape.bezierCurveTo(x+2.5, y+2.5, x+2,   y,     x,     y);
        shape.bezierCurveTo(x-3,   y,     x-3,   y+3.5, x-3,   y+3.5);
        shape.bezierCurveTo(x-3,   y+5.5, x-1.5, y+7.7, x+2.5, y+9.5);
        shape.bezierCurveTo(x+6,   y+7.7, x+8,   y+4.5, x+8,   y+3.5);
        shape.bezierCurveTo(x+8,   y+3.5, x+8,   y,     x+5,   y);
        shape.bezierCurveTo(x+3.5, y,     x+2.5, y+2.5, x+2.5, y+2.5);

        const geometry  = new THREE.ShapeGeometry(shape);        
        
        const fillMaterial = new THREE.MeshPhongMaterial({color:0xDDDDDD});
        const cube = new THREE.Mesh(geometry,fillMaterial);

        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry),lineMaterial);

        const group = new THREE.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._model = group;
    }
*/
/*
    _setModel() {
        class CustomSinCurve extends THREE.Curve {
            constructor(scale) {
                super();
                this.scale = scale;
            }
            getPoint(t){
                const tx = t*3-1.5;
                const ty = Math.sin(2*Math.PI*t);
                const tz = 0;
                return new THREE.Vector3(tx,ty,tz).multiplyScalar(this.scale);
            }
        }

        const path   = new CustomSinCurve(10);
        const points = path.getPoint(10);
        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints(points);
 
        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry),lineMaterial);

        this._scene.add(line);
    }
*/
/*
    _setModel() {
        class CustomSinCurve extends THREE.Curve {
            constructor(scale) {
                super();
                this.scale = scale;
            }
            getPoint(t){
                const tx = t*3-1.5;
                const ty = Math.sin(2*Math.PI*t);
                const tz = 0;
                return new THREE.Vector3(tx,ty,tz).multiplyScalar(this.scale);
            }
        }
        
        const path   = new CustomSinCurve(10);
        const geometry = new THREE.TubeGeometry(path, 40, 2, 16, true);
        
        const fillMaterial = new THREE.MeshPhongMaterial({color:0xDDDDDD});
        const cube = new THREE.Mesh(geometry,fillMaterial);

        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry),lineMaterial);

        const group = new THREE.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._model = group;
    }
*/
/*
    _setModel() {
        const points = [];
        for(let index=0; index<10; ++index){
            points.push(new THREE.Vector2(Math.sin(index*0.2)*3+3, (index-5)*0.8));
        }
        const geometry = new THREE.LatheGeometry(points, 16, 0, Math.PI);

        const fillMaterial = new THREE.MeshPhongMaterial({color:0xDDDDDD});
        const cube = new THREE.Mesh(geometry,fillMaterial);

        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry),lineMaterial);

        const group = new THREE.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._model = group;
    }
*/
/*
    _setModel() {
        const shape = new THREE.Shape();
        
        const x=-2.5, y=-5;
        shape.moveTo(x+2.5, y+2.5);
        shape.bezierCurveTo(x+2.5, y+2.5, x+2,   y,     x,     y);
        shape.bezierCurveTo(x-3,   y,     x-3,   y+3.5, x-3,   y+3.5);
        shape.bezierCurveTo(x-3,   y+5.5, x-1.5, y+7.7, x+2.5, y+9.5);
        shape.bezierCurveTo(x+6,   y+7.7, x+8,   y+4.5, x+8,   y+3.5);
        shape.bezierCurveTo(x+8,   y+3.5, x+8,   y,     x+5,   y);
        shape.bezierCurveTo(x+3.5, y,     x+2.5, y+2.5, x+2.5, y+2.5);

        const settings = {
            steps: 2,
            depth: 4,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 5
        };

        const geometry = new THREE.ExtrudeGeometry(shape, settings);
        
        const fillMaterial = new THREE.MeshPhongMaterial({color:0xDDDDDD});
        const cube = new THREE.Mesh(geometry,fillMaterial);

        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry),lineMaterial);

        const group = new THREE.Group();
        group.add(cube);
        group.add(line);

        this._scene.add(group);
        this._model = group;
    }
*/
    _setModel() {
        const frontLoader = new FontLoader();
        async function loadFont(that) {
            const url  = "../core/fonts/helvetiker_regular.typeface.json"
            const font = await new Promise((resolve, reject) => {
                frontLoader.load(url, resolve, undefined, reject);
            });

            const geometry = new TextGeometry("T E S T", {
                font:   font,
                size:   5,
                depth:  1,
                curveSegments: 4,
                // setting for ExtrudeGeometry
                bevelEnabled: true,
                bevelThickness: 0.3,
                bevelSize: 0.3,
                bevelSegments: 4
            });
            geometry.center();

            const fillMaterial = new THREE.MeshPhongMaterial({color:0xDDDDDD});
            const cube = new THREE.Mesh(geometry,fillMaterial);

            const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
            const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry),lineMaterial);

            const group = new THREE.Group();
            group.add(cube);
            group.add(line);

            that._scene.add(group);
            that._model = group;
        };
        loadFont(this);
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
        //this._model.rotation.x = time;
        //this._model.rotation.y = time;
    }
}

window.onload = function() {
    new App();
}