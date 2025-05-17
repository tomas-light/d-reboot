import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function showHideElementOnScroll(element: Element) {
  ScrollTrigger.create({
    trigger: element,
    start: 'top 40%', // анимация запускается, когда группа символов достигает x% скрола сверху экрана
    end: 'top 40%', // анимация завершается, когда группа символов достигает y% скрола сверху экрана
    scrub: true, // привязка к позиции скрола, а не ко времени
    onUpdate: (scrollTrigger) => {
      const isScrollDown = scrollTrigger.direction > 0;
      if (isScrollDown) {
        element.classList.add('showed');
      } else {
        element.classList.remove('showed');
      }
    },
  });
}
