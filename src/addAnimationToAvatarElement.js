import { gsap } from 'gsap';
import SplitType from 'split-type';

/**
 * @param {HTMLImageElement} avatarElement
 * */
export function addAnimationToAvatarElement(avatarElement) {
  gsap.fromTo(
    avatarElement,
    {
      display: 'inline-block',
    },
    {
      display: 'inline-block',
      scrollTrigger: {
        trigger: avatarElement,
        start: 'top 60%',
        end: 'top 40%',
        scrub: true, // привязка к позиции скролла, а не ко времени
      },
    }
  );
}
