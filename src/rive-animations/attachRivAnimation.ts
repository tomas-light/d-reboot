import { Alignment, Fit, Layout, Rive } from '@rive-app/canvas';
import { resizeRiveOnWindowResize } from './resizeRiveOnWindowResize';
import type { RivKind } from './RivKind';

export function attachRivAnimation(
  canvas: HTMLCanvasElement,
  rivName: string | undefined
) {
  let src: string;

  switch (rivName as RivKind) {
    case 'ai':
      src = '/rive-animations/ai-icon.riv';
      // src = '/rive-animation-assets/3d.riv';
      break;

    case 'eco':
      src = '/rive-animations/eco-icon.riv';
      break;

    case 'down':
      src = '/rive-animations/down-icon.riv';
      break;

    case 'up':
      src = '/rive-animations/up-icon.riv';
      break;

    case 'lock':
      src = '/rive-animations/lock-icon.riv';
      break;

    case 'discuss':
      src = '/rive-animations/discuss-icon.riv';
      break;

    case 'energy':
      src = '/rive-animations/energy-icon.riv';
      break;

    default:
      console.warn(`unsupported riv animation name (${rivName})`);
      return;
  }

  const riveInstance = new Rive({
    src: src,
    canvas,
    stateMachines: RIVE_ANIMATIONS_STATE_MACHINE_NAME,
    layout: new Layout({
      fit: Fit.FitWidth, // Change to: rive.Fit.Contain, or Cover
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

const RIVE_ANIMATIONS_STATE_MACHINE_NAME = 'State Machine 1'; // same hardcoded name in all animations
