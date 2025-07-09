const messages = {
  required: 'Email and password are required',
  // wrong: 'Something went wrong.',
  networkError: 'Network error. Please try again.',
  incorrectPass: 'Incorrect password',
  minPass: 'Password must be minimum 8 symbols',
  maxPass: 'Password must be maximum 16 symbols',
  incorrectLang: 'Incorrect language',
  incorrectEmail: 'Incorrect email',
  maxEmail: 'Email is too long (max 50 symbols)',
};

const REGEXES = {
  LANG: /[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  EMPTY_SYMBOL: /\s/,
};

module.exports = {
  messages,
  REGEXES,
};
