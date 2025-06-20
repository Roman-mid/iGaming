// const { messages, REGEXES } = require('./constants/validations');

const messages = {
  required: 'Required field',
  wrong: 'Something went wrong.',
  networkError: 'Network error. Please try again.',
};

const REGEXES = {
  LANG: /[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

const loginForm = document.querySelector('.loginForm');
const errorMessages = loginForm.querySelectorAll('.errorMessage');
const inpustForm = loginForm.querySelectorAll('input');
const [emailErrorMessage, passwordErrorMessage] = errorMessages;
const [emailInput, passwordInput] = inpustForm;

let isPasswordError = true;
let isEmailError = true;

const loginUser = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    const email = data.email.trim();
    const password = data.password.trim();

    if (!email) {
      emailErrorMessage.textContent = messages.required;
    }

    if (!password) {
      passwordErrorMessage.textContent = messages.required;
    }

    if (!email || !password || isPasswordError || isEmailError) {
      return;
    }

    const result = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    const responseData = await result.json();

    if (!result.ok) {
      emailErrorMessage.textContent = responseData.error || messages.wrong;

      passwordErrorMessage.textContent = responseData.error || messages.wrong;
      return;
    }

    window.location.href = '/';
  } catch (error) {
    console.error('Request failed:', error);

    passwordErrorMessage.textContent = messages.networkError;
  }
};

const validateEmail = (e) => {
  isEmailError = false;
  emailErrorMessage.textContent = '';

  e.target.value = e.target.value.replace(/ /g, '');
  const value = e.target.value;

  if (!REGEXES.EMAIL.test(value)) {
    emailErrorMessage.textContent = 'Incorrect email';
    isEmailError = true;
  }
};

const validatePassword = (e) => {
  isPasswordError = false;
  passwordErrorMessage.textContent = '';

  e.target.value = e.target.value.replace(/ /g, '');
  const value = e.target.value;

  if (!value) {
    passwordErrorMessage.textContent = messages.required;
    isPasswordError = true;
    return;
  }

  if (REGEXES.LANG.test(value)) {
    passwordErrorMessage.textContent = 'Only Latin characters are allowed.';
    isPasswordError = true;

    return;
  }

  if (value.length < 8) {
    passwordErrorMessage.textContent = 'Must be minimun 8 symbols';
    isPasswordError = true;

    return;
  }

  if (value.length > 16) {
    passwordErrorMessage.textContent = 'Must be no more then 16 symbols';
    isPasswordError = true;

    return;
  }
};

loginForm.addEventListener('submit', loginUser);

passwordInput.addEventListener('input', validatePassword);
emailInput.addEventListener('input', validateEmail);
