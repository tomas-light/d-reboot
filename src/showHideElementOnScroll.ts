import { gsap } from 'gsap';

export function showHideElementOnScroll(element: Element) {
  gsap.from(element, {
    width: 0,
    ['margin-left']: '-0.5rem', // когда элемент скрыт, без этого сдвига ощущение, что между текстом два пробела стоит
    // display: 'inline-flex',
    scrollTrigger: {
      start: 'top 40%', // анимация запускается, когда группа символов достигает x% скрола сверху экрана
      end: 'top 40%', // анимация завершается, когда группа символов достигает y% скрола сверху экрана
      scrub: true, // привязка к позиции скрола, а не ко времени
      trigger: element,
    },
  });
}
