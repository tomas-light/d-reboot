import { gsap } from 'gsap';
import SplitType from 'split-type';

export function animateWordsAppearing(textSelector: string) {
  const animatedCharacters = gsap.utils.toArray(textSelector) as HTMLElement[];

  const splattedTypes = animatedCharacters.map(
    (spanElement) => new SplitType(spanElement, { types: 'words' })
  );

  const splattedWords = splattedTypes.flatMap((type) => type.words);

  gsap.from(splattedWords, {
    opacity: 0.2, // gsap.from, поэтому начиная с этой прозрачности и до 1
    stagger: 0.1, // задержка между элементами - каждый следующий через 0.1 секунды
    color: 'var(--color-gray-950)',
    scrollTrigger: {
      start: 'top 40%', // анимация запускается, когда группа символов достигает x% скрола сверху экрана
      scrub: true, // привязка к позиции скрола, а не ко времени
      trigger: splattedWords,
      end: 'bottom 40%', // анимация завершается, когда группа символов достигает y% скрола снизу экрана
      endTrigger: splattedWords.at(-1),
    },
  });
}
