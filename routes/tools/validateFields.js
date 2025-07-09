const { messages, REGEXES } = require('../constants/validations');

const isValidPassword = (res, password) => {
  password = password.trim();
  if (REGEXES.EMPTY_SYMBOL.test(password)) {
    res.status(400).json({ message: messages.incorrectPass });
    return false;
  }

  if (REGEXES.LANG.test(password)) {
    res.status(400).json({ message: messages.incorrectLang });
    return false;
  }

  if (password.length < 8) {
    res.status(400).json({ message: messages.minPass });
    return false;
  }

  if (password.length > 16) {
    res.status(400).json({ message: messages.maxPass });
    return false;
  }
  return true;
};

const isValidEmail = (res, email) => {
  email = email.trim();
  if (!REGEXES.EMAIL.test(email)) {
    res.status(400).json({ message: messages.incorrectEmail });
    return false;
  }

  if (email.length > 50) {
    res.status(400).json({ message: messages.maxEmail });
    return false;
  }

  return true;
};

module.exports = { isValidPassword, isValidEmail };
