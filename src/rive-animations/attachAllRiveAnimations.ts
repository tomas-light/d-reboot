import { attachRivAnimation } from './attachRivAnimation';

export async function attachAllRiveAnimations(
  canvases: NodeListOf<HTMLCanvasElement>
) {
  const riveMap = new Map<
    string,
    Awaited<ReturnType<typeof attachRivAnimation>>
  >();

  const rivCanvases = Array.from(canvases) as HTMLCanvasElement[];

  const promises = rivCanvases.map(async (rivCanvas) => {
    if (rivCanvas.dataset.riveName == null) {
      return;
    }

    const rive = await attachRivAnimation(
      rivCanvas,
      rivCanvas.dataset.riveName
    );

    riveMap.set(rivCanvas.dataset.riveName, rive);
  });

  await Promise.allSettled(promises);

  return riveMap;
}
