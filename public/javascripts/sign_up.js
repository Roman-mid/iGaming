import { validateEmail, validatePassword } from './tools/validations.js';
import { messages } from './constants/validations.js';

const signUpForm = document.querySelector('.signUpForm');
const inpustForm = signUpForm.querySelectorAll('input');
const errorMessages = signUpForm.querySelectorAll('.errorMessage');
const userExist = document.querySelector('.userExist');
const [emailErrorMessage, passwordErrorMessage] = errorMessages;
const [emailInput, passwordInput] = inpustForm;

const formValidFields = {
  isPasswordError: true,
  isEmailError: true,
};

const signUpUser = async (e, formValidFields) => {
  e.preventDefault();

  try {
    const formData = new FormData(signUpForm);
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

    const result = await fetch('/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const res = await result.json();

    if (result.status === 400) {
      console.log(res.message);
      passwordErrorMessage.textContent = res.message;
      return;
    }

    if (!result.ok) {
      userExist.textContent = res.message || messages.wrong;
      return;
    }

    alert(res.message);
    window.location.href = '/login';
  } catch (error) {
    console.error('Request failed:', error.message);
  }
};

signUpForm.addEventListener('submit', (e) => signUpUser(e, formValidFields));

emailInput.addEventListener('input', (e) =>
  validateEmail(e, formValidFields, emailErrorMessage, userExist)
);

passwordInput.addEventListener('input', (e) =>
  validatePassword(e, formValidFields, passwordErrorMessage)
);
