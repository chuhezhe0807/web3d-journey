import { Camera, PerspectiveCamera } from "three";

export function isPerspectiveCamera(camera: Camera): camera is PerspectiveCamera {
    return camera instanceof PerspectiveCamera;
}