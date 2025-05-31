import { Alignment, Fit, Layout, Rive } from '@rive-app/canvas';
import envJson from '../env.json';
import { resizeRiveOnWindowResize } from './resizeRiveOnWindowResize';

// same hardcoded name in all animations (the name is embedded in files)
const RIVE_ANIMATIONS_STATE_MACHINE_NAME = 'State Machine 1';

export function attachStaticRivAnimation(
  canvas: HTMLCanvasElement,
  rivName: string
) {
  const riveInstance = new Rive({
    src: `${envJson.BASE_URL_TO_PUBLIC}static-rive-animations/${rivName}.riv`,
    canvas,
    stateMachines: RIVE_ANIMATIONS_STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.Fill,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  resizeRiveOnWindowResize(riveInstance);
}
