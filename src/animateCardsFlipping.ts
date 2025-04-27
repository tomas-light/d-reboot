type Options = {
  cardsContainersSelector: string;
} & Omit<AnimateCardsContainerOptions, 'container'>;

export function animateCardsFlipping(options: Options) {
  const { cardsContainersSelector, ...restOptions } = options;

  const cardsContainers = document.querySelectorAll(cardsContainersSelector);
  cardsContainers.forEach((container) => {
    animateCardsContainer({ container, ...restOptions });
  });
}

type AnimateCardsContainerOptions = {
  container: Element;
  findNextCard: (container: Element) => Element | undefined;
  findCurrentCard: (container: Element) => Element | undefined;

  elevatedClassName: string;
  currentClassName: string;
  nextClassName: string;
};

function animateCardsContainer(options: AnimateCardsContainerOptions) {
  const {
    container,
    findCurrentCard,
    findNextCard,
    elevatedClassName,
    currentClassName,
    nextClassName,
  } = options;

  container.addEventListener('mouseenter', () => {
    const nextCard = findNextCard(container);
    if (nextCard != null) {
      nextCard.classList.add(elevatedClassName);
    }
  });

  container.addEventListener('mouseleave', () => {
    const nextCard = findNextCard(container);
    if (nextCard != null) {
      nextCard.classList.remove(elevatedClassName);
    }
  });

  container.addEventListener('click', async () => {
    const currentCard = findCurrentCard(container);
    const nextCard = findNextCard(container);
    if (currentCard == null || nextCard == null) {
      return;
    }

    if (!nextCard.classList.contains(elevatedClassName)) {
      nextCard.classList.add(elevatedClassName);
      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      });
    }

    container.removeChild(currentCard);
    currentCard.classList.remove(currentClassName);
    container.appendChild(currentCard);

    nextCard.classList.remove(elevatedClassName);
    nextCard.classList.remove(nextClassName);
    nextCard.classList.add(currentClassName);

    const furtherNextCard = findNextCard(container);
    if (furtherNextCard != null) {
      furtherNextCard.classList.add(nextClassName);
    }
  });
}
