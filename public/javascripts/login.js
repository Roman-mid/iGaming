import { validateEmail, validatePassword } from './tools/validations.js';
import { messages } from './constants/validations.js';

const loginForm = document.querySelector('.loginForm');
const errorMessages = loginForm.querySelectorAll('.errorMessage');
const inpustForm = loginForm.querySelectorAll('input');
const [emailErrorMessage, passwordErrorMessage] = errorMessages;
const [emailInput, passwordInput] = inpustForm;

const formValidFields = {
  isPasswordError: true,
  isEmailError: true,
};

const loginUser = async (e, formValidFields) => {
  e.preventDefault();
  console.log(formValidFields);
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

    if (
      !email ||
      !password ||
      formValidFields.isPasswordError === true ||
      formValidFields.isEmailError === true
    ) {
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

loginForm.addEventListener('submit', (e) => loginUser(e, formValidFields));

passwordInput.addEventListener('input', (e) =>
  validatePassword(e, formValidFields, passwordErrorMessage)
);

emailInput.addEventListener('input', (e) =>
  validateEmail(e, formValidFields, emailErrorMessage)
);
