const EVERYTHING_BUT_ASCII_LETTERS = /[^a-z]/giu;
const SINGLE_UPPERCASE_LETTER = /[A-Z]/u;

export const toSnakeCase = <T extends string>(input: T): string => {
  const str: string = input.replaceAll(EVERYTHING_BUT_ASCII_LETTERS, '');

  if (!str.length) return '';

  if (!SINGLE_UPPERCASE_LETTER.test(str)) return '';

  const [firstLetter = ''] = str;

  if (!firstLetter.length) return '';

  if (!SINGLE_UPPERCASE_LETTER.test(firstLetter)) return '';

  const words: string[] = [];

  let currentWord = '';

  for (const char of str.split('')) {
    if (SINGLE_UPPERCASE_LETTER.test(char)) {
      if (currentWord.length) words.push(currentWord);

      currentWord = '';
    }

    currentWord += char;
  }

  words.push(currentWord);

  return words.join('_').toLowerCase();
};
