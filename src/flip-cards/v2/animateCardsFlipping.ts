export function animateCardsFlipping() {
  const containers = document.querySelectorAll('[data-flipping-cards]');

  for (const cardContainer of containers) {
    animateCardFlipping(cardContainer);
  }
}

function animateCardFlipping(cardContainer: Element) {
  setCardOrders();

  setInterval(async () => {
    await makeTransition();
    setCardOrders();
  }, 2000);

  function setCardOrders() {
    const cards = Array.from(cardContainer.querySelectorAll('.card'));
    cards.reverse().forEach((card, index) => {
      card.setAttribute('data-order', (index + 1).toString());
    });
  }

  async function makeTransition() {
    cardContainer.setAttribute('data-transition', '');

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        moveFirstCardBehind();
        resolve();
      }, 200);
    });

    cardContainer.removeAttribute('data-transition');
  }

  function moveFirstCardBehind() {
    const card = cardContainer.querySelector('.card[data-order="1"]');
    if (card != null) {
      cardContainer.removeChild(card);
      cardContainer.prepend(card);
    }
  }
}
