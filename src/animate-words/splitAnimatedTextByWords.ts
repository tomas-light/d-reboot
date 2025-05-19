import SplitType from 'split-type';

export function splitAnimatedTextByWords(textSelector: string) {
  const animatedCharacters = Array.from(
    document.querySelectorAll(textSelector)
  ) as HTMLElement[];

  animatedCharacters.forEach(
    (spanElement) => new SplitType(spanElement, { types: 'words' })
  );
}
