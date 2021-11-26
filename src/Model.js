import { MMDLoader } from '../jsm/loaders/MMDLoader.js';
import * as THREE from '../build/three.module.js';
const loader = new MMDLoader();
const standardListText = ['eyebrow_troubled_left', 'eyebrow_troubled_right', 'eyebrow_angry_left', 'eyebrow_angry_right'
    , 'eyebrow_serious_left', 'eyebrow_serious_right', 'eyebrow_happy_left', 'eyebrow_happy_right', 'eyebrow_lowered_left', 'eyebrow_lowered_right'
    , 'eyebrow_raised_left', 'eyebrow_raised_right', 'eye_wink_left', 'eye_wink_right', 'eye_happy_wink_left', 'eye_happy_wink_right', 'eye_relaxed_left'
    , 'eye_relaxed_right', 'eye_unimpressed_left', 'eye_unimpressed_right', 'eye_raised_lower_eyelid_left', 'eye_raised_lower_eyelid_right', 'eye_surprised_left'
    , 'eye_surprised_right', 'iris_small_left', 'iris_small_right', 'mouth_aaa', 'mouth_iii', 'mouth_uuu', 'mouth_eee', 'mouth_ooo', 'mouth_delta', 'mouth_smirk'
    , 'mouth_raised_corner_left', 'mouth_raised_corner_right', 'mouth_lowered_corner_left', 'mouth_lowered_corner_right'];

export class Model {
    constructor(modelInfo) {
        this.modelPath = modelInfo.location;
        this.mesh = null;
        this.standardlist = null;
        this.loadModel(modelInfo);
        this.modelInfo = modelInfo;
    }

    initStandardList(modelInfo) {
        let standardlist = {};
        let existMorphs = {};

        standardListText.forEach(text => {
            if (existMorphs[modelInfo[text]] == 1) {
                standardlist[text] = { "mapIndex": -1, "value": 0.0 };
            } else {
                standardlist[text] = { "mapIndex": modelInfo[text], "value": 0.0 };

                existMorphs[modelInfo[text]] = 1;
            }
        });

        standardlist["iris_rotation_x"] = { "mapIndex": -2, "value": 0.0 };
        standardlist["iris_rotation_y"] = { "mapIndex": -2, "value": 0.0 };
        standardlist["head_x"] = { "mapIndex": -2, "value": 0.0 };
        standardlist["head_y"] = { "mapIndex": -2, "value": 0.0 };
        standardlist["head_z"] = { "mapIndex": -2, "value": 0.0 };

        return standardlist;
    }

    getStandardlist() {
        return this.standardlist;
    }

    getStandardlistWithIndex() {
        let indexCount = 0;
        let standardlistWithIndex = {};
        for (const key in this.standardlist) {
            standardlistWithIndex[indexCount] = this.standardlist[key]
            indexCount += 1;
        }
        let model_info = { "location": this.modelPath }
        model_info["standardlist"] = standardlistWithIndex
        return model_info;
    }

    setStandardlist(key, value) {
        this.standardlist[key] = value;
    }

    loadModel(modelInfo) {
        loader.load(this.modelPath, (object) => {
            this.setMesh(object)
            this.standardlist = this.initStandardList(modelInfo);
        });
    }

    setMesh(object) {
        this.mesh = object;
        this.mesh.position.y = - 10;
    }

    getMesh() {
        return this.mesh;
    }

    findeye_index() {
        let leye_index = -1;
        let reye_index = -1;
        let head_index = -1;
        for (let i = 0; i < this.mesh.skeleton.bones.length; i++) {
            if (this.mesh.skeleton.bones[i].name == '左目') {
                leye_index = i;
            }
            else if (this.mesh.skeleton.bones[i].name == '右目') {
                reye_index = i;
            }
            else if (this.mesh.skeleton.bones[i].name == '頭') {
                head_index = i;
            }
        }
        return [leye_index, reye_index, head_index]
    }

    rotationNomalization(x, minx, maxx) {
        if (x > 0) {
            return x * maxx
        } else {
            return -1 * x * minx
        }
    }

    onChangeRotation(key, value) {
        let [leye_index, reye_index, head_index] = this.findeye_index()
        let nomalizationAngel
        switch (key) {
            case "iris_rotation_x":
                nomalizationAngel = this.rotationNomalization(value, this.modelInfo["RXNA"], this.modelInfo["RXPA"]);
                nomalizationAngel = THREE.MathUtils.degToRad(nomalizationAngel)
                this.mesh.skeleton.bones[leye_index].rotation.x = nomalizationAngel;
                this.mesh.skeleton.bones[reye_index].rotation.x = nomalizationAngel;
                break;
            case "iris_rotation_y":
                nomalizationAngel = this.rotationNomalization(value, this.modelInfo["RYNA"], this.modelInfo["RYPA"]);
                nomalizationAngel = THREE.MathUtils.degToRad(nomalizationAngel)
                this.mesh.skeleton.bones[leye_index].rotation.y = nomalizationAngel;
                this.mesh.skeleton.bones[reye_index].rotation.y = nomalizationAngel;
                break;
            case "head_x":
                nomalizationAngel = this.rotationNomalization(value, -15, 15);
                nomalizationAngel = THREE.MathUtils.degToRad(nomalizationAngel)
                this.mesh.skeleton.bones[head_index].rotation.x = nomalizationAngel;
                this.mesh.skeleton.bones[head_index].rotation.x = nomalizationAngel;
                break;
            case "head_y":
                nomalizationAngel = this.rotationNomalization(value, -15, 15);
                nomalizationAngel = THREE.MathUtils.degToRad(nomalizationAngel)
                this.mesh.skeleton.bones[head_index].rotation.y = nomalizationAngel;
                this.mesh.skeleton.bones[head_index].rotation.y = nomalizationAngel;
                break;
            case "head_z":
                nomalizationAngel = this.rotationNomalization(value, -15, 15);
                nomalizationAngel = THREE.MathUtils.degToRad(nomalizationAngel)
                this.mesh.skeleton.bones[head_index].rotation.z = nomalizationAngel;
                this.mesh.skeleton.bones[head_index].rotation.z = nomalizationAngel;
                break;
            default:
                break;
        }
    }
}