import * as THREE from "../core/build/three.module.js"
//import { OrbitControls } from "../core/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "../core/jsm/loaders/GLTFLoader.js"

class App {
    constructor() {
        this._setupAmmo();
        this._game = true;
        
    }

    _setupAmmo() {
        Ammo().then(() => {
            const collisionConfiguration  = new Ammo.btDefaultCollisionConfiguration(),
                dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
                overlappingPairCache = new Ammo.btDbvtBroadphase(),
                solver = new Ammo.btSequentialImpulseConstraintSolver();
                
            const physicsWorld = new Ammo.btDiscreteDynamicsWorld(
                dispatcher, overlappingPairCache, solver, collisionConfiguration
            );

            physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));
            this._physicsWorld = physicsWorld;

            this._rigidBodies = [];
            this._tmpTrans = new Ammo.btTransform();

            this._setupThreeJs();
            this._setupCamera();
            this._setupLight();
            this._setupModel();
            this._setupControls();
            this._setupEvents();

            console.log("초기화 완료");
        });
    }

    _setupThreeJs() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        renderer.outputEncoding = THREE.sRGBEncoding;
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            10
        );

        camera.position.set(0, 0.6, -3.1);
        camera.lookAt(0, -2.0, 3.5);
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;

        const ambientLight = new THREE.AmbientLight(color, 0.1);
        this._scene.add(ambientLight);

        const light1 = new THREE.DirectionalLight(color, 0.7);
        light1.position.set(0, 2, -3.5);
        light1.target.position.set(0, -0.4, 0.5);
        this._scene.add(light1);

        const light2 = new THREE.DirectionalLight(color, 0.7);
        light2.position.set(0, 1, 3);
        light2.target.position.set(0, -0.4, 0.5);
        this._scene.add(light2);
    }

    _setupModel() {
        new GLTFLoader().load("../data/GLB/bowling.glb", (gltf) => {
            this._models = gltf.scene;

            this._createStage();
            this._createPins();
            this._createDummyBall();
        });
    }

    _createStage() {
        const models = this._models;
        const mesh = models.getObjectByName("Stage");

        const pos = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z };
        const quat = { x: 0, y: 0, z: 0, w: 1 };
        const mass = 0;

        mesh.position.set(pos.x, pos.y, pos.z);
        this._scene.add(mesh);

        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
        const motionState = new Ammo.btDefaultMotionState(transform);

        const colShape = this._createAmmoShapeFromMesh(mesh);
        colShape.setMargin(0.01);

        const localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);

        body.setFriction(0.5);
        body.setRollingFriction(0.1);
        body.setRestitution(0.2);

        this._physicsWorld.addRigidBody(body);
    }

    _createAmmoShapeFromMesh(mesh) {    
        // new ammo vectors
        const vectA = new Ammo.btVector3(0,0,0);
        const vectB = new Ammo.btVector3(0,0,0);
        const vectC = new Ammo.btVector3(0,0,0);
        
        // new empty ammo shape
        const shape = new Ammo.btConvexHullShape();
        
        mesh.traverse(child => {
            if(child.isMesh) {
                // retrieve vertices positions from object
                const verticesPos = child.geometry.getAttribute("position").array;
                const triangles = [];
                for (let i = 0; i < verticesPos.length; i += 3) {
                    triangles.push({ x:verticesPos[i], y:verticesPos[i+1], z:verticesPos[i+2] })
                }

                // use triangles data to draw ammo shape
                for (let i = 0; i < triangles.length-3; i += 3) {
                    vectA.setX(triangles[i].x);
                    vectA.setY(triangles[i].y);
                    vectA.setZ(triangles[i].z);
                    shape.addPoint(vectA, true);

                    vectB.setX(triangles[i+1].x);
                    vectB.setY(triangles[i+1].y);
                    vectB.setZ(triangles[i+1].z);
                    shape.addPoint(vectB, true);

                    vectC.setX(triangles[i+2].x);
                    vectC.setY(triangles[i+2].y);
                    vectC.setZ(triangles[i+2].z);
                    shape.addPoint(vectC, true);
                }                
            }
        });

        Ammo.destroy(vectA);
        Ammo.destroy(vectB);
        Ammo.destroy(vectC);

        return shape;
    }

    _createDummyBall() {
        const models = this._models;
        const pos = { x: 0, y: .2, z: -2.4 };
        const mesh = models.getObjectByName("Ball");
        this._ball = mesh;

        mesh.position.set(pos.x, pos.y, pos.z);
        this._scene.add(mesh);

        gsap.fromTo(mesh.position, { x: 0.3 },
            {
                x: -0.3,
                duration: 2,
                yoyo: true,
                repeat: -1,
                ease: "power2.inOut"
            }
        );
    }

    _createPins() {
        const models = this._models;
        const pin = models.getObjectByName("Pin");

        const quat = { x: 0, y: 0, z: 0, w: 1 };
        const mass = 1;
        const colShape = this._createAmmoShapeFromMesh(pin);
        colShape.setMargin(0.01);
        const localInertia = new Ammo.btVector3(0, 0, 0);
        colShape.calculateLocalInertia(mass, localInertia);

        for(let i=0; i<10; i++) {
            const name = `Pin_Pos_${i+1}`;
            const mesh = pin.clone();
            mesh.name = name;

            const posObj = models.getObjectByName(name);
            const pos = { x: posObj.position.x, y: posObj.position.y + 0.2, z: posObj.position.z };
            mesh.position.copy(pos);
            this._scene.add(mesh);

            const transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
            transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));
            const motionState = new Ammo.btDefaultMotionState(transform);

            const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
            const body = new Ammo.btRigidBody(rbInfo);

            body.setFriction(0.4);
            body.setRollingFriction(0.1);
            body.setRestitution(1);

            this._physicsWorld.addRigidBody(body);

            mesh.userData.physicsBody = body;
            this._rigidBodies.push(mesh);
        }
    }

    _updatePhysics(deltaTime) {
        this._physicsWorld.stepSimulation(deltaTime, 10);

        const cnt = this._rigidBodies.length;
        for(let i=0; i<cnt; i++) {
            const objThree = this._rigidBodies[i];
            const objAmmo = objThree.userData.physicsBody;

            const ms = objAmmo.getMotionState();
            if(ms) {
                ms.getWorldTransform(this._tmpTrans);
                const p = this._tmpTrans.getOrigin();
                const q = this._tmpTrans.getRotation();

                objThree.position.set(p.x(), p.y(), p.z());
                objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
            }
        }
    }

    _setupControls() {
        //this._orbitControls = new OrbitControls(this._camera, this._divContainer);
    }

    _setupEvents() {
        window.onresize = this.resize.bind(this);
        this.resize();

        this._mouseY = 0;
        this._prevMouseY = 0;

        window.addEventListener("mouseup", () => {
            if(this._game){
                const power = 1+Math.random();
                console.log("power",power);
                const pos = { x: this._ball.position.x, y: this._ball.position.y, z: this._ball.position.z };
                this._scene.remove(this._ball);
                this._createBall(pos, power);
                this._game = false;
            }
        });

        document.querySelector("#try-again").addEventListener("click", () => {
            let countPins = 0;
            let countFallenPins = 0;

            for(let i=0; i<10; i++) {
                const name = `Pin_Pos_${i+1}`;
                const mesh = this._scene.getObjectByName(name);

                if(mesh) {
                    countPins++;
                    if(mesh.position.y < 0) {
                        countFallenPins++;
                        this._scene.remove(mesh);
                        this._physicsWorld.removeRigidBody(mesh.userData.physicsBody);
                    }
                }
            }

            if(countFallenPins === countPins) this._createPins();

            this._scene.add(this._ball);
            this._showTryAgainButton(false);
            this._game = true;
        });

        this._clock = new THREE.Clock();
        requestAnimationFrame(this.render.bind(this));
    }

    _createBall(pos, power) {
        const quat = { x: 0, y: 0, z: 0, w: 1 };
        const mass = 3;
        const mesh = this._ball.clone();
        mesh.position.set(pos.x, pos.y, pos.z);
        this._scene.add(mesh);

        const transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
        transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

        const motionState = new Ammo.btDefaultMotionState(transform);
        const colShape = this._createAmmoShapeFromMesh(mesh);
        colShape.setMargin(0.01);

        const localInertia = new Ammo.btVector3(0,0,0);
        colShape.calculateLocalInertia(mass, localInertia);

        const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, colShape, localInertia);
        const body = new Ammo.btRigidBody(rbInfo);
        this._physicsWorld.addRigidBody(body);

        body.setFriction(0.5);
        body.setRollingFriction(0.05);
        body.setRestitution(0.9);

        mesh.userData.physicsBody = body;
        this._rigidBodies.push(mesh);

        const force = new Ammo.btVector3(0, 0, power*100);
        const targetPos = new Ammo.btVector3(0.2, 0.2, 0);
        body.applyForce(force, targetPos);

        gsap.to(this._camera.position, {
            delay: 1.5,
            duration: 3,
            z: 1,
            ease: "power2.out",
            onComplete: () => {
                this._showTryAgainButton(true);
            }
        })
    }

    _showTryAgainButton(bShow) {
        if(bShow) {
            document.querySelector("#try-again").classList.add("show");
        } else {
            document.querySelector("#try-again").classList.remove("show");

            gsap.to(this._camera.position, {
                delay: 0,
                duration: 1,
                z: -3.1,
                ease: "power2.out"
            });
        }
    }

    update() {
        const delta = this._clock.getDelta();
        //this._orbitControls.update();

        this._updatePhysics(delta);
    }

    render() {
        this._renderer.render(this._scene, this._camera);   
        this.update();

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}