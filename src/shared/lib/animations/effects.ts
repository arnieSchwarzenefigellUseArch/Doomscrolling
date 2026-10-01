import './easing';
import {gsap} from 'gsap';

gsap.registerEffect({
  name: 'atomRevealIn',
  effect: (target: gsap.TweenTarget) => {
    return gsap.fromTo(
      target,
      {
        autoAlpha: 0,
        scale: 0.3,
      },
      {
        duration: 0.3,
        ease: 'standard',
        autoAlpha: 1,
        scale: 1,
      },
    );
  },
});

gsap.registerEffect({
  name: 'atomRevealOut',
  effect: (target: gsap.TweenTarget) => {
    return gsap.to(target, {
      duration: 0.3,
      ease: 'standardExit',
      autoAlpha: 0,
      scale: 0.3,
    });
  },
});

gsap.registerEffect({
  name: 'atomFadeIn',
  effect: (target: gsap.TweenTarget) => {
    return gsap.fromTo(
      target,
      {
        autoAlpha: 0,
      },
      {
        duration: 0.3,
        ease: 'standard',
        autoAlpha: 1,
      },
    );
  },
});
gsap.registerEffect({
  name: 'atomFadeOut',
  effect: (target: gsap.TweenTarget) => {
    return gsap.to(target, {
      duration: 0.3,
      ease: 'standardExit',
      autoAlpha: 0,
    });
  },
});
