import {
  animation, trigger, animateChild, group,
  transition, animate, style, query
} from '@angular/animations';

export const flyInAnimation = animation([
  style({
    transform: '{{ transform }}',
    opacity: '{{ opacity }}'
  }),
  animate('{{ time }}')
]);

export const flyOutAnimation = animation([
  animate('{{ time }}'),
  style({
    transform: '{{ transform }}',
    opacity: '{{ opacity }}'
  })
]);