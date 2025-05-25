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

    if (riveMap.has(rivCanvas.dataset.riveName)) {
      rivCanvas.dataset.riveName = makeUniqueName(
        riveMap,
        rivCanvas.dataset.riveName
      );
    }

    riveMap.set(rivCanvas.dataset.riveName, rive);
  });

  await Promise.allSettled(promises);

  return riveMap;
}

function makeUniqueName(
  map: Map<string, unknown>,
  name: string,
  index = 0
): string {
  const uniqueName = (name += `_${index}`);
  if (map.has(uniqueName)) {
    return makeUniqueName(map, name, index + 1);
  }
  return uniqueName;
}
