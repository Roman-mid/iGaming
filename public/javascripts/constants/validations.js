const messages = {
  required: 'Required field',
  wrong: 'Something went wrong.',
  networkError: 'Network error. Please try again.',
};

const REGEXES = {
  LANG: /[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

module.exports = { messages, REGEXES };
