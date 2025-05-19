import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

export function animateWordsAppearing(textSelector: string) {
  const animatedCharacters = gsap.utils.toArray(textSelector) as HTMLElement[];

  const splattedTypes = animatedCharacters.map(
    (spanElement) => new SplitType(spanElement, { types: 'words' })
  );

  const splattedWords = splattedTypes.flatMap((type) => type.words);

  ScrollTrigger.create({
    start: 'top 40%', // анимация запускается, когда группа символов достигает x% скрола сверху экрана
    scrub: true, // привязка к позиции скрола, а не ко времени
    trigger: splattedWords,
    end: 'bottom 40%', // анимация завершается, когда группа символов достигает y% скрола снизу экрана
    endTrigger: splattedWords.at(-1),
    onUpdate: (scrollTrigger) => {
      const closestIndex = Math.trunc(
        scrollTrigger.progress * splattedWords.length
      );

      const wordElements = Array.from(
        document.querySelectorAll(`${textSelector} .word`)
      );
      const isScrollDown = scrollTrigger.direction > 0;
      if (isScrollDown) {
        const wordsBefore = wordElements.slice(0, closestIndex + 1);
        wordsBefore.forEach((word) => {
          word?.setAttribute('data-showed', '');
        });
      } else {
        const wordsAfter = wordElements.slice(closestIndex);
        wordsAfter.forEach((word) => {
          word?.removeAttribute('data-showed');
        });
      }
    },
  });
}
