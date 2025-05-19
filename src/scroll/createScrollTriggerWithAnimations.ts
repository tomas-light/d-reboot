import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export async function createScrollTriggerWithAnimations(options: {
  elementsToBind: NodeListOf<Element>;
  changeState: {
    showElement: (element: HTMLElement) => void;
    hideElement: (element: HTMLElement) => void;
    showRive: (element: HTMLElement) => void;
    hideRive: (element: HTMLElement) => void;
  };
}) {
  const { elementsToBind, changeState } = options;

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: elementsToBind,
    start: 'top 40%', // анимация запускается, когда элемент достигает x% скрола сверху экрана
    scrub: true, // привязка к позиции скрола, а не ко времени
    end: 'bottom 40%', // анимация завершается, когда последний элемент достигает y% скрола снизу экрана
    endTrigger: elementsToBind[elementsToBind.length - 1],
    onUpdate: (scrollTrigger) => {
      const closestIndex = Math.trunc(
        scrollTrigger.progress * elementsToBind.length
      );

      const elements = Array.from(elementsToBind) as HTMLElement[];
      const isScrollDown = scrollTrigger.direction > 0;
      if (isScrollDown) {
        // работаем со всеми элементами для случаев, когда скролл резко изменил позицию, чтобы не оставалось дырок
        const elementsBefore = elements.slice(0, closestIndex + 1);
        elementsBefore.forEach((element) => {
          if (element.dataset.riveName != null) {
            changeState.showRive(element);
          } else {
            changeState.showElement(element);
          }
        });
      } else {
        // работаем со всеми элементами для случаев, когда скролл резко изменил позицию, чтобы не оставалось дырок
        const elementsAfter = elements.slice(closestIndex);
        for (const element of elementsAfter) {
          if (element.dataset.riveName != null) {
            changeState.hideRive(element);
          } else {
            changeState.hideElement(element);
          }
        }
      }
    },
  });
}
