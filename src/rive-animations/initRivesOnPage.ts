import { createScrollTriggerWithAnimations } from '../scroll/createScrollTriggerWithAnimations';
import { attachAllRiveAnimations } from './attachAllRiveAnimations';

export async function initRivesOnPage() {
  const riveMap = attachAllRiveAnimations({
    canvases: document.querySelectorAll('canvas[data-rive]'),
    getRiveName: (canvas) => canvas.dataset.name,
    setRiveName: (canvas, newRiveName) => {
      canvas.dataset.name = newRiveName;
    },
    isStatic: (canvas) => canvas.dataset.static != null,
  });

  const { addTimer, removeTimer } = createTimerHandlers();

  await createScrollTriggerWithAnimations({
    elementsSelector:
      '[data-animated-characters] .word, [data-animated-horizontal-line], canvas[data-rive]:not([data-static]), [data-last-element-to-scroll]',
    lastElementSelector: '[data-last-element-to-scroll]',
    changeState: {
      showElement: async (element) => {
        element.setAttribute('data-showed', '');

        const { dataset } = element as HTMLElement;
        const riveName = dataset && dataset.rive != null && dataset.name;

        const showDelayMs = parseNumberFromDataset(dataset, 'showDelayMs');

        if (riveName) {
          const rive = riveMap.get(riveName);
          if (rive) {
            removeTimer(riveName);
            await rive.attachIfNeeded();

            if (showDelayMs) {
              addTimer(
                riveName,
                () => {
                  rive.show();
                },
                showDelayMs
              );
            } else {
              rive.show();
            }
          }
        }
      },
      hideElement: (element) => {
        const { dataset } = element as HTMLElement;
        const riveName = dataset && dataset.rive != null && dataset.name;
        const hideDelayMs = parseNumberFromDataset(dataset, 'hideDelayMs');

        if (!riveName) {
          element.removeAttribute('data-showed');
          return;
        }

        const rive = riveMap.get(riveName);
        if (rive) {
          removeTimer(riveName);
          rive.hide();

          if (hideDelayMs) {
            addTimer(
              riveName,
              () => {
                element.removeAttribute('data-showed');
              },
              hideDelayMs
            );
          } else {
            element.removeAttribute('data-showed');
          }
        }
      },
    },
  });
}

function createTimerHandlers() {
  const riveTimersMap = new Map();
  return {
    addTimer,
    removeTimer,
  };

  function addTimer(
    riveName: string,
    callback: VoidFunction,
    showDelayMs: number
  ) {
    const timer = setTimeout(() => {
      callback();
    }, showDelayMs);

    riveTimersMap.set(riveName, timer);
  }

  function removeTimer(riveName: string) {
    const timer = riveTimersMap.get(riveName);
    if (timer) {
      clearTimeout(timer);
      riveTimersMap.delete(riveName);
    }
  }
}

function parseNumberFromDataset(
  dataset: undefined | Record<string, string | undefined>,
  name: string
) {
  const data = dataset?.[name];

  if (!data) {
    return undefined;
  }

  const parsed = parseInt(data, 10);
  if (isNaN(parsed)) {
    return undefined;
  } else {
    return parsed;
  }
}
