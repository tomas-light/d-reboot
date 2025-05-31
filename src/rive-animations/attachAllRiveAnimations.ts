import { attachRivAnimation } from './attachRivAnimation';
import { attachStaticRivAnimation } from './attachStaticRivAnimation';

type RiveName = string;
const emptyFunction: VoidFunction = (): void => {};

type RiveManager = {
  riveName: RiveName;
  attachIfNeeded: () => Promise<void>;
  show: VoidFunction;
  hide: VoidFunction;
};

type SetCanvasRiveName = (
  canvas: HTMLCanvasElement,
  newRiveName: string
) => void;

type RiveMap = Map<RiveName, RiveManager>;
type AttachedRiveNames = Set<RiveName>;

export function attachAllRiveAnimations(options: {
  canvases: NodeListOf<HTMLCanvasElement>;
  getRiveName: (canvas: HTMLCanvasElement) => string | undefined;
  setRiveName: SetCanvasRiveName;
  isStatic: (canvas: HTMLCanvasElement) => boolean;
}) {
  const { canvases, isStatic, getRiveName, setRiveName } = options;

  const riveMap: RiveMap = new Map();
  const attachedRiveNames: AttachedRiveNames = new Set();

  const rivCanvases = Array.from(canvases) as HTMLCanvasElement[];

  rivCanvases.forEach((canvas) => {
    const riveName = getRiveName(canvas);
    if (riveName == null) {
      return;
    }

    if (isStatic(canvas)) {
      attachStaticRivAnimation(canvas, riveName);
    } else {
      const riveManager: RiveManager = createRiveManager({
        riveMap,
        attachedRiveNames,
        setRiveName,
        canvas,
        riveName,
      });

      riveMap.set(riveName, riveManager);
    }
  });

  return riveMap;
}

function makeUniqueName(
  namesSet: Set<string>,
  name: string,
  index = 0
): string {
  const uniqueName = (name += `_${index}`);
  if (namesSet.has(uniqueName)) {
    return makeUniqueName(namesSet, name, index + 1);
  }
  return uniqueName;
}

function createRiveManager(options: {
  riveName: RiveName;
  canvas: HTMLCanvasElement;
  setRiveName: SetCanvasRiveName;
  riveMap: RiveMap;
  attachedRiveNames: AttachedRiveNames;
}) {
  const { riveName, canvas, setRiveName, riveMap, attachedRiveNames } = options;

  const showingManager = {
    show: emptyFunction,
    hide: emptyFunction,
  };

  const riveManager: RiveManager = {
    riveName,
    show: () => showingManager.show(),
    hide: () => showingManager.hide(),
    attachIfNeeded: async () => {
      if (attachedRiveNames.has(riveName)) {
        return;
      }

      const isNameAlreadyUsed = attachedRiveNames.has(riveName);
      if (isNameAlreadyUsed) {
        const uniqueRiveName = makeUniqueName(attachedRiveNames, riveName);
        setRiveName(canvas, uniqueRiveName);
        riveMap.delete(riveName);
        riveMap.set(uniqueRiveName, riveManager);
        attachedRiveNames.add(uniqueRiveName);
      } else {
        attachedRiveNames.add(riveName);
      }

      const rive = await attachRivAnimation(canvas, riveName);

      showingManager.show = () => {
        const { riveInstance, playIconShowing } = rive;
        riveInstance.play(); // если анимация еще не была запущена
        playIconShowing();
      };
      showingManager.hide = () => {
        const { playIconHiding } = rive;
        playIconHiding();
      };
    },
  };

  return riveManager;
}
