import SplitType from 'split-type';

export function splitAnimatedTextByWords(textSelector: string) {
  const animatedCharacters = Array.from(
    document.querySelectorAll(textSelector)
  ) as HTMLElement[];

  const splitTypes = animatedCharacters.map(
    (spanElement) =>
      new SplitType(spanElement, { types: 'words', tagName: 'span' })
  );

  removeExtraWrappersThatBreaksLayout(splitTypes);
}

function removeExtraWrappersThatBreaksLayout(splitTypes: SplitType[]) {
  for (const splitType of splitTypes) {
    if (!splitType.words) {
      continue;
    }

    for (const wordElement of splitType.words) {
      wordElement.removeAttribute('style');

      const isNotSpan = wordElement.tagName.toLowerCase() !== 'span';
      if (isNotSpan) {
        continue;
      }

      const { parentElement } = wordElement;
      if (!parentElement) {
        continue;
      }

      const isParentSpan = parentElement.tagName.toLowerCase() === 'span';
      const hasParentInlineDisplay =
        parentElement.style.display === 'inline-block';
      if (isParentSpan && hasParentInlineDisplay) {
        parentElement.replaceWith(...parentElement.childNodes);
      }
    }
  }
}
