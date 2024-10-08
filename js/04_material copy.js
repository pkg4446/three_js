import * as THREE from "../core/build/three.module.js";
import { OrbitControls } from "../core/jsm/controls/OrbitControls.js";
import { VertexNormalsHelper } from "../core/jsm/helpers/VertexNormalsHelper.js";

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
        camera.position.z = 3;
        this._camera = camera;
        this._scene.add(camera);
    }

    _setLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this._scene.add(ambientLight);

        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color,intensity);
        light.position.set(-1,2,4);
        //this._scene.add(light);
        this._camera.add(light);
    }
/*
    _setModel() {
        const vertices = [];
        for (let index = 0; index < 10000; index++) {
            const axis_x = THREE.MathUtils.randFloatSpread(5);
            const axis_y = THREE.MathUtils.randFloatSpread(5);
            const axis_z = THREE.MathUtils.randFloatSpread(5);
            vertices.push(new THREE.Vector3(axis_x,axis_y,axis_z));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const sprite   = new THREE.TextureLoader().load("../core/textures/sprites/disc.png");
        const material = new THREE.PointsMaterial({
            map:   sprite,
            alphaTest: 0.5,
            color: 0xff0000,
            size:  0.1,
            sizeAttenuation: true
        });

        const points = new THREE.Points(geometry, material);
        this._scene.add(points);
    }
*/
/*
    _setModel() {
        const vertices = [
            new THREE.Vector3(-1,1,0),
            new THREE.Vector3(1,1,0),
            new THREE.Vector3(-1,-1,0),
            new THREE.Vector3(1,-1,0)
        ];

        const geometry = new THREE.BufferGeometry().setFromPoints(vertices);
        const material = new THREE.LineBasicMaterial({color:0xffffff});

        //const line = new THREE.Line(geometry, material);
        //const line = new THREE.LineSegments(geometry, material);
        const line = new THREE.LineLoop(geometry, material);
        this._scene.add(line);
    }
*/
/*
    _setModel() {

        const material = new THREE.MeshBasicMaterial({
            color:      0xffff00,
            wireframe:  false,

            visible:    true,
            transparent:true,
            opacity:    0.5,
            depthTest:  true,
            depthWrite: true,
            side:       THREE.FrontSide
        });

        const material = new THREE.MeshLambertMaterial({
            transparent:true,
            opacity:    0.5,
            side:       THREE.DoubleSide,

            color:      0xffff00,
            emissive:   0x555500,
            wireframe:  false
        });

        const material = new THREE.MeshPhongMaterial({
            color:      0xff0000,
            emissive:   0x555500,
            specular:   0xffff00,
            shininess:  1,
            flatShading:false,
            wireframe:  false
        });

        const material = new THREE.MeshStandardMaterial({
            color:      0xff0000,
            emissive:   0x555500,
            roughness:  0.25,
            metalness:  0.1,
            wireframe:  false,
            flatShading:false
        });

        const material = new THREE.MeshPhysicalMaterial({
            color:      0xffff00,
            emissive:   0x555500,
            roughness:  1,
            metalness:  0,
            clearcoat:  0.9,
            clearcoatRoughness:0.1,
            wireframe:  false,
            flatShading:false
        });

        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        box.position.set(-1.5, 0, 0);
        this._scene.add(box);
        
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
        box.position.set(1.5, 0, 0);
        this._scene.add(sphere);
        
    }
*/
/*
    _setModel() {
        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load(
            "../core/textures/uv_grid_opengl.jpg",
            texture => {
                texture.repeat.x = 1;
                texture.repeat.y = 1;

                //texture.wrapS = THREE.MirroredRepeatWrapping;
                //texture.wrapT = THREE.MirroredRepeatWrapping;
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;

                texture.offset.x = 0;
                texture.offset.y = 0;
                
                //texture.rotation = THREE.MathUtils.degToRad(45);
                //texture.center.x = 0.5;
                //texture.center.y = 0.5;

                //texture.magFilter = THREE.LinearFilter;

                //texture.minFilter = THREE.NearestFilter;
                //texture.minFilter = THREE.LinearFilter;
                //texture.minFilter = THREE.NearestMipMapNearestFilter;
                //texture.minFilter = THREE.LinearMipMapNearestFilter;
                //texture.minFilter = THREE.NearestMipMapLinearFilter;
                //texture.minFilter = THREE.LinearMipMapLinearFilter;
            }
        );
        
        const material = new THREE.MeshStandardMaterial({
            map: map
        });

        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        box.position.set(-1.5, 0, 0);
        this._scene.add(box);
        
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
        box.position.set(1.5, 0, 0);
        this._scene.add(sphere);
        
    }
*/
_setModel() {
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load("../core/img/glass/Glass_Window_002_basecolor.jpg");
    const mapAO = textureLoader.load("../core/img/glass/Glass_Window_002_ambientOcclusion.jpg");
    const mapHeight = textureLoader.load("../core/img/glass/Glass_Window_002_height.png");
    const mapNormal = textureLoader.load("../core/img/glass/Glass_Window_002_normal.jpg");
    const mapRoughness = textureLoader.load("../core/img/glass/Glass_Window_002_roughness.jpg");
    const mapMetalic = textureLoader.load("../core/img/glass/Glass_Window_002_metallic.jpg");
    const mapAlpha = textureLoader.load("../core/img/glass/Glass_Window_002_opacity.jpg");
    const mapLight = textureLoader.load("../core/img/glass/Glass_Window_002_basecolor.jpg");
    
    const material = new THREE.MeshStandardMaterial({
        map: map,
        normalMap: mapNormal,

        displacementMap: mapHeight,
        displacementScale: 0.2,
        displacementScale: 0.15,
        
        aoMap: mapAO,
        aoMapIntensity: 1,

        roughnessMap: mapRoughness,
        roughness: 0.5,

        metalnessMap: mapMetalic,
        metalness: 0.5,

        alphaMap: mapAlpha,
        transparent: true,
        side: THREE.DoubleSide,

        lightMap: mapLight,
        lightMapIntensity: 2
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 256,256,256), material);
    box.position.set(-1, 0, 0);
    box.geometry.attributes.uv2 = box.geometry.attributes.uv;
    this._scene.add(box);

    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 128, 128), material);
    sphere.position.set(1, 0, 0);
    sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
    this._scene.add(sphere);

    //const boxHelper = new VertexNormalsHelper(box, 0.1, 0xffff00);
    //this._scene.add(boxHelper)
    //const spherHelper = new VertexNormalsHelper(sphere, 0.1, 0xffff00);
    //this._scene.add(spherHelper);
    
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
    }
}

window.onload = function() {
    new App();
}