export function animateCardsFlipping() {
  const containers = document.querySelectorAll('[data-flipping-cards]');

  for (const cardContainer of containers) {
    animateCardFlipping(cardContainer);
  }
}

function animateCardFlipping(cardContainer: Element) {
  setCardOrders();

  function setCardOrders() {
    const cards = cardContainer.querySelectorAll('.card');
    cards.forEach((card, index) => {
      card.setAttribute('data-order', (index + 1).toString());
    });
  }

  cardContainer.addEventListener('mouseenter', () => {
    void elevateSecondCard();
  });

  cardContainer.addEventListener('mouseleave', () => {
    lowerSecondCard();
  });

  cardContainer.addEventListener('click', async () => {
    await elevateSecondCard();
    moveFirstCardBehind();
    lowerSecondCard();

    setCardOrders();
  });

  function moveFirstCardBehind() {
    const card = cardContainer.querySelector('.card[data-order="1"]');
    if (card != null) {
      cardContainer.removeChild(card);
      cardContainer.appendChild(card);
    }
  }

  async function elevateSecondCard() {
    const secondCard = cardContainer.querySelector(
      '.card[data-order="2"]'
    ) as HTMLElement | null;
    if (secondCard == null) {
      return;
    }

    if (secondCard.dataset.elevated == null) {
      secondCard.setAttribute('data-elevated', '');

      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      });
    }
  }

  function lowerSecondCard() {
    const secondCard = cardContainer.querySelector(
      '.card[data-order="2"]'
    ) as HTMLElement | null;
    if (secondCard != null) {
      secondCard.removeAttribute('data-elevated');
    }
  }
}
