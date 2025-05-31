import { Alignment, Fit, Layout, Rive } from '@rive-app/canvas';
import envJson from '../env.json';
import { resizeRiveOnWindowResize } from './resizeRiveOnWindowResize';

// same hardcoded name in all animations (the name is embedded in files)
const RIVE_ANIMATIONS_STATE_MACHINE_NAME = 'State Machine 1';

export function attachStaticRivAnimation(
  canvas: HTMLCanvasElement,
  rivName: string
) {
  const urlToFile = `${envJson.BASE_URL_TO_PUBLIC}static-rive-animations/${rivName}.riv`;
  const riveInstance = new Rive({
    src: urlToFile,
    canvas,
    stateMachines: RIVE_ANIMATIONS_STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    autoplay: true,
    onLoad: () => {
      // Prevent a blurry canvas by using the device pixel ratio
      riveInstance.resizeDrawingSurfaceToCanvas();
    },
  });

  resizeRiveOnWindowResize(riveInstance);
}
