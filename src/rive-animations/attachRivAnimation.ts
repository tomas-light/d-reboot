import {
  Alignment,
  Fit,
  Layout,
  Rive,
  StateMachineInput,
} from '@rive-app/canvas';
import { resizeRiveOnWindowResize } from './resizeRiveOnWindowResize';

// same hardcoded name in all animations (the name is embedded in files)
const RIVE_ANIMATIONS_STATE_MACHINE_NAME = 'State Machine 1';

export function attachRivAnimation(
  canvas: HTMLCanvasElement,
  rivName: string | undefined
) {
  return new Promise<{
    riveInstance: Rive;
    stateMachineInputs: StateMachineInput[];
    playIconShowing: VoidFunction;
    playIconHiding: VoidFunction;
  }>((resolve) => {
    const riveInstance = new Rive({
      src: `/rive-animations/${rivName}.riv`,
      canvas,
      stateMachines: RIVE_ANIMATIONS_STATE_MACHINE_NAME,
      layout: new Layout({
        fit: Fit.FitWidth, // Change to: rive.Fit.Contain, or Cover
        alignment: Alignment.Center,
      }),
      // autoplay: true,
      onLoad: () => {
        // Prevent a blurry canvas by using the device pixel ratio
        riveInstance.resizeDrawingSurfaceToCanvas();

        const stateMachineInputs = riveInstance.stateMachineInputs(
          RIVE_ANIMATIONS_STATE_MACHINE_NAME
        );
        resolve({
          riveInstance,
          stateMachineInputs,
          playIconShowing: () => {
            const stateMachine = stateMachineInputs?.[0];
            stateMachine.value = 0; // embedded behavior
          },
          playIconHiding: () => {
            const stateMachine = stateMachineInputs?.[0];
            stateMachine.value = 1; // embedded behavior
          },
        });
      },
    });

    resizeRiveOnWindowResize(riveInstance);
  });
}
