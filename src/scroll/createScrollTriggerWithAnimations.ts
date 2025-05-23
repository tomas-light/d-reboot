import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

type ChangeElementState = (element: HTMLElement) => void;

export async function createScrollTriggerWithAnimations(options: {
  elementsToBind: NodeListOf<Element>;
  changeState: {
    showElement: ChangeElementState;
    hideElement: ChangeElementState;
    showRive: ChangeElementState;
    hideRive: ChangeElementState;
  };
}) {
  const { elementsToBind, changeState } = options;

  gsap.registerPlugin(ScrollTrigger);

  const { getStateModify, initializeElementsState } =
    createElementsState(changeState);
  initializeElementsState(Array.from(elementsToBind) as HTMLElement[]);

  let trigger: ScrollTrigger | undefined = undefined;
  let lastWidth: number | undefined;

  const resizeObserver = new ResizeObserver((entries) => {
    window.requestAnimationFrame(() => {
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }

      entries.forEach((entry) => {
        const [borderBoxSize] = entry.borderBoxSize;
        const { inlineSize: width } = borderBoxSize;
        if (width === lastWidth) {
          return;
        }

        lastWidth = width;

        const elements = Array.from(elementsToBind) as HTMLElement[];
        const firstElement = elements[0];
        const offsetTop = firstElement.offsetTop;

        const start = `top ${offsetTop}`;
        const end = `bottom ${offsetTop}`;

        if (!trigger) {
          trigger = ScrollTrigger.create({
            start,
            end,
            trigger: elementsToBind,
            endTrigger: elementsToBind[elementsToBind.length - 1],
            scrub: true, // привязка к позиции скрола, а не ко времени
            onUpdate: (scrollTrigger) => {
              const closestIndex = Math.trunc(
                scrollTrigger.progress * elementsToBind.length
              );
              updateElementsState(closestIndex);
            },
          });
        } else {
          trigger.vars.start = start;
          trigger.vars.end = end;
          trigger.refresh();

          const closestIndex = Math.trunc(
            trigger.progress * elementsToBind.length
          );
          updateElementsState(closestIndex);
        }
      });
    });

    function updateElementsState(elementIndex: number) {
      const elements = Array.from(elementsToBind) as HTMLElement[];

      for (let index = 0; index < elements.length; index++) {
        const state = getStateModify(elements, index);
        if (elementIndex > 0 && index <= elementIndex) {
          state.show();
        } else {
          state.hide();
        }
      }
    }
  });

  resizeObserver.observe(document.body);
}

function createElementsState(changeState: {
  showElement: ChangeElementState;
  hideElement: ChangeElementState;
  showRive: ChangeElementState;
  hideRive: ChangeElementState;
}) {
  const showedElementIndexes = new Set<number>();
  const hiddenElementIndexes = new Set<number>();

  const showedRiveIndexes = new Set<number>();
  const hiddenRiveIndexes = new Set<number>();

  return {
    initializeElementsState,
    getStateModify,
  };

  function initializeElementsState(elements: HTMLElement[]) {
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];

      let showedIndexes: Set<number>;
      let hiddenIndexes: Set<number>;

      if (element.dataset.riveName == null) {
        showedIndexes = showedElementIndexes;
        hiddenIndexes = hiddenElementIndexes;
      } else {
        showedIndexes = showedRiveIndexes;
        hiddenIndexes = hiddenRiveIndexes;
      }

      if (element.dataset.showed == null) {
        hiddenIndexes.add(index);
      } else {
        showedIndexes.add(index);
      }
    }
  }

  function getStateModify(elements: HTMLElement[], elementIndex: number) {
    if (
      showedElementIndexes.has(elementIndex) ||
      hiddenElementIndexes.has(elementIndex)
    ) {
      return {
        show: () => {
          hiddenElementIndexes.delete(elementIndex);

          if (!showedElementIndexes.has(elementIndex)) {
            showedElementIndexes.add(elementIndex);
            changeState.showElement(elements[elementIndex]);
          }
        },
        hide: () => {
          showedElementIndexes.delete(elementIndex);

          if (!hiddenElementIndexes.has(elementIndex)) {
            hiddenElementIndexes.add(elementIndex);
            changeState.hideElement(elements[elementIndex]);
          }
        },
      };
    }

    return {
      show: () => {
        hiddenRiveIndexes.delete(elementIndex);

        if (!showedRiveIndexes.has(elementIndex)) {
          showedRiveIndexes.add(elementIndex);
          changeState.showRive(elements[elementIndex]);
        }
      },
      hide: () => {
        showedRiveIndexes.delete(elementIndex);

        if (!hiddenRiveIndexes.has(elementIndex)) {
          hiddenRiveIndexes.add(elementIndex);
          changeState.hideRive(elements[elementIndex]);
        }
      },
    };
  }
}
