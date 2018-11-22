import Color from 'color';

export const getDarker = (color, amount = 0.1) =>
  Color(color)
    .darken(amount)
    .toString();

export const getLighter = (color, amount = 0.1) =>
  Color(color)
    .lighten(amount)
    .toString();
