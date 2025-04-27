type Options = {
  cardContainer: HTMLElement;
  container: HTMLElement;
  selectCard: (selector: string) => NodeListOf<HTMLElement>;
};

export function animateCardsFlipping(options: Options) {
  const { cardContainer, selectCard } = options;

  cardContainer.addEventListener('mouseenter', () => {
    const nextCard = findNextCard();
    elevateCard(nextCard);
  });

  cardContainer.addEventListener('mouseleave', () => {
    const nextCard = findNextCard();
    lowerCard(nextCard);
  });

  cardContainer.addEventListener('click', async () => {
    const currentCard = findCurrentCard();
    const nextCard = findNextCard();
    if (currentCard == null || nextCard == null) {
      return;
    }

    if (nextCard.dataset.elevated == null) {
      elevateCard(nextCard);

      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      });
    }

    moveCurrentCardBehind(currentCard);

    lowerCard(nextCard);
    nextCard.removeAttribute('data-next');
    nextCard.setAttribute('data-current', '');

    const furtherNextCard = findNextCard();
    furtherNextCard?.setAttribute('data-next', '');
  });

  function findNextCard() {
    const notCurrentCards = selectCard(':not([data-current])');
    return notCurrentCards[0];
  }

  function findCurrentCard() {
    const currentCards = selectCard('[data-current]');
    return currentCards[0];
  }

  function elevateCard(card: Element) {
    card?.setAttribute('data-elevated', '');
  }
  function lowerCard(card: Element) {
    card?.removeAttribute('data-elevated');
  }

  function moveCurrentCardBehind(card: Element) {
    cardContainer.removeChild(card);
    card.removeAttribute('data-current');
    cardContainer.appendChild(card);
  }
}
