import * as React from "react";
import * as ReactDOM from "react-dom";
import { MODULE_COMMON } from './constants';


interface Third3DDemoProps {
    context: CodeInContext;
}

interface Third3DDemoDemoStates {
    loaded?: boolean;
}

var loadCount = 0;


class Third3DDemo extends React.Component<Third3DDemoProps, Third3DDemoDemoStates> {

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    componentDidMount() {
        const common = this.props.context.modules[MODULE_COMMON];
        common.loadScript("https://threejs.org/build/three.js", (err) => {
            console.log("script loaded");
            if (err) {
                // print useful message
            }
            else {
                this.setState({ loaded: true });
            }
        });
    }

    executeAnimatePlanet() {
        const THREE = window["THREE"];
        const current = ReactDOM.findDOMNode(this) as Element;
        const width = current.clientWidth;
        const height = width * 0.8;

        var SCREEN_WIDTH = width;
        var SCREEN_HEIGHT = height;
        var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

        var container, stats;
        var camera, scene, renderer, mesh;
        var cameraRig, activeCamera, activeHelper;
        var cameraPerspective, cameraOrtho;
        var cameraPerspectiveHelper, cameraOrthoHelper;
        var frustumSize = 600;

        init();
        animate();

        function init() {

            container = document.createElement('div');
            current.appendChild(container);

            scene = new THREE.Scene();

            //

            camera = new THREE.PerspectiveCamera(50, 0.5 * aspect, 1, 10000);
            camera.position.z = 2500;

            cameraPerspective = new THREE.PerspectiveCamera(50, 0.5 * aspect, 150, 1000);

            cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);
            scene.add(cameraPerspectiveHelper);

            //
            cameraOrtho = new THREE.OrthographicCamera(0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000);

            cameraOrthoHelper = new THREE.CameraHelper(cameraOrtho);
            scene.add(cameraOrthoHelper);

            //

            activeCamera = cameraPerspective;
            activeHelper = cameraPerspectiveHelper;


            // counteract different front orientation of cameras vs rig

            cameraOrtho.rotation.y = Math.PI;
            cameraPerspective.rotation.y = Math.PI;

            cameraRig = new THREE.Group();

            cameraRig.add(cameraPerspective);
            cameraRig.add(cameraOrtho);

            scene.add(cameraRig);

            //

            mesh = new THREE.Mesh(
                new THREE.SphereBufferGeometry(100, 16, 8),
                new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
            );
            scene.add(mesh);

            var mesh2 = new THREE.Mesh(
                new THREE.SphereBufferGeometry(50, 16, 8),
                new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
            );
            mesh2.position.y = 150;
            mesh.add(mesh2);

            var mesh3 = new THREE.Mesh(
                new THREE.SphereBufferGeometry(5, 16, 8),
                new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
            );
            mesh3.position.z = 150;
            cameraRig.add(mesh3);

            //

            var geometry = new THREE.BufferGeometry();
            var vertices = [];

            for (var i = 0; i < 10000; i++) {

                vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
                vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
                vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z

            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            var particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }));
            scene.add(particles);

            //

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
            container.appendChild(renderer.domElement);

            renderer.autoClear = false;

        }

        function animate() {

            requestAnimationFrame(animate);

            render();
        }


        function render() {

            var r = Date.now() * 0.0005;

            mesh.position.x = 700 * Math.cos(r);
            mesh.position.z = 700 * Math.sin(r);
            mesh.position.y = 700 * Math.sin(r);

            mesh.children[0].position.x = 70 * Math.cos(2 * r);
            mesh.children[0].position.z = 70 * Math.sin(r);

            if (activeCamera === cameraPerspective) {

                cameraPerspective.fov = 35 + 30 * Math.sin(0.5 * r);
                cameraPerspective.far = mesh.position.length();
                cameraPerspective.updateProjectionMatrix();

                cameraPerspectiveHelper.update();
                cameraPerspectiveHelper.visible = true;

                cameraOrthoHelper.visible = false;

            } else {

                cameraOrtho.far = mesh.position.length();
                cameraOrtho.updateProjectionMatrix();

                cameraOrthoHelper.update();
                cameraOrthoHelper.visible = true;

                cameraPerspectiveHelper.visible = false;

            }

            cameraRig.lookAt(mesh.position);

            renderer.clear();

            activeHelper.visible = false;

            renderer.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
            renderer.render(scene, activeCamera);

            activeHelper.visible = true;

            renderer.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
            renderer.render(scene, camera);

        }
    }

    executeAnimate() {
        const THREE = window["THREE"];
        const current = ReactDOM.findDOMNode(this) as Element;
        const width = current.clientWidth;
        const height = width * 0.8;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

        var renderer = new THREE.WebGLRenderer();


        renderer.setSize(width, height);
        current.appendChild(renderer.domElement);

        var geometry = new THREE.BoxGeometry();
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;

        var animate = function () {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();
    }

    renderThird() {
        const { context } = this.props;
        if (!this.state.loaded) {
            return null;
        }

        const common = context.modules[MODULE_COMMON]
        const { AkButton } = common;
        return <div>
            <div style={{ flexDirection: "row", marginBottom: 10 }}>
                <AkButton onClick={() => this.executeAnimate()}>A Box</AkButton>
                <AkButton onClick={() => this.executeAnimatePlanet()}>Let's Rock</AkButton>
            </div>
        </div>;
    }

    render() {
        const { context } = this.props;
        const { loaded } = this.state;

        const common = context.modules[MODULE_COMMON]
        const { AkSpin } = common;
        if (loaded) {
            return this.renderThird();
        } else {
            return <div>loading</div>;
        }
        // return <AkSpin spinning={loaded}>
        //     {this.renderThird()}
        // </AkSpin>;
    }
}


export class CodeInApplication implements CodeInComp {
    render(context: CodeInContext, fieldsValues: any, readonly: boolean) {
        return <Third3DDemo context={context} />;
    }

    requiredFields() {
        return [];
    }

    requiredModules() {
        return [];
    }
}