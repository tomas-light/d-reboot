import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

type ChangeElementState = (element: Element) => void;

export async function createScrollTriggerWithAnimations(options: {
  elementsSelector: string;
  lastElementSelector: string;
  changeState: {
    showElement: ChangeElementState;
    hideElement: ChangeElementState;
  };
}) {
  const { elementsSelector, lastElementSelector, changeState } = options;

  gsap.registerPlugin(ScrollTrigger);

  const elementsToBind = document.querySelectorAll(elementsSelector);
  const elementsCount = elementsToBind.length;

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

        const elements = document.querySelectorAll(elementsSelector);

        const currentScrollY = window.scrollY;

        const firstElement = elements[0] as HTMLElement;
        const lastElement = elements[elements.length - 1] as HTMLElement;

        firstElement.scrollIntoView({ block: 'end' });
        const firstElementViewportTop =
          firstElement.getBoundingClientRect().top;

        lastElement.scrollIntoView({ block: 'start' });
        const lastElementViewportTop = lastElement.getBoundingClientRect().top;

        window.scrollTo({ top: currentScrollY });

        const start = `top ${firstElementViewportTop}px`;
        const end = `bottom ${lastElementViewportTop}px`;

        if (!trigger) {
          trigger = new ScrollTrigger({
            start,
            end,
            trigger: elementsSelector,
            endTrigger: lastElementSelector,
            scrub: true, // привязка к позиции скрола, а не ко времени
            onUpdate: (scrollTrigger) => {
              const closestIndex = Math.trunc(
                scrollTrigger.progress * elementsCount
              );
              updateElementsState(closestIndex);
            },
          });
        } else {
          trigger.vars.start = start;
          trigger.vars.end = end;
          trigger.refresh();

          const closestIndex = Math.trunc(trigger.progress * elementsCount);
          updateElementsState(closestIndex);
        }
      });
    });

    function updateElementsState(elementIndex: number) {
      const elements = document.querySelectorAll(elementsSelector);

      for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        if (elementIndex > 0 && index <= elementIndex) {
          changeState.showElement(element);
        } else {
          changeState.hideElement(element);
        }
      }
    }
  });

  resizeObserver.observe(document.body);
}
