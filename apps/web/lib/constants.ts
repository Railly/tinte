export const SAMPLE_CODE = `function leftpad(str, len, ch) {
  str = String(str);
  var i = -1;

  if (!ch && ch !== 0) ch = 'Hello World';

  len = len - str.length;

  while (i++ < len) {
    str = ch + str;
  }

  return str;
}`;
