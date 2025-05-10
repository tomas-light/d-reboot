import { Rive } from '@rive-app/canvas';

export function resizeRiveOnWindowResize(riveInstance: Rive) {
  // Re-adjust the rendering surface if the window resizes
  window.addEventListener(
    'resize',
    () => {
      riveInstance.resizeDrawingSurfaceToCanvas();
    },
    false
  );
}
