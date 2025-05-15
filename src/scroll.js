import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initGsapScroll() {
  gsap.registerPlugin(ScrollTrigger);
}
