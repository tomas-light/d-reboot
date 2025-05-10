import { Alignment, Fit, Layout, Rive } from '@rive-app/canvas';
import { resizeRiveOnWindowResize } from '../resizeRiveOnWindowResize';

export function createDesignRiv(canvas: HTMLCanvasElement) {
  const riveInstance = new Rive({
    src: '/src/rive-animations/design/design.riv',
    canvas,
    layout: new Layout({
      fit: Fit.FitWidth, // Change to: rive.Fit.Contain, or Cover
      alignment: Alignment.Center,
    }),
    autoplay: true,
    onLoad: () => {
      // Prevent a blurry canvas by using the device pixel ratio
      riveInstance.resizeDrawingSurfaceToCanvas();
      riveInstance.enableFPSCounter();
    },
  });

  resizeRiveOnWindowResize(riveInstance);
}
