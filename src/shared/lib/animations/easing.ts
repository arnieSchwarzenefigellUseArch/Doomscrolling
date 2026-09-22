import {gsap} from 'gsap';
import {CustomEase} from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
CustomEase.create('standard', '0, 0, 0.2, 1');
