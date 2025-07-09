import { messages, REGEXES } from '../constants/validations.js';

export const validateEmail = (
  e,
  formValidFields,
  emailErrorMessage,
  userExist = undefined
) => {
  formValidFields.isEmailError = false;
  emailErrorMessage.textContent = '';

  if (userExist) {
    userExist.textContent = '';
  }

  e.target.value = e.target.value.replace(/ /g, '');
  const value = e.target.value;

  if (!REGEXES.EMAIL.test(value)) {
    emailErrorMessage.textContent = 'Incorrect email';
    formValidFields.isEmailError = true;
  }
};

export const validatePassword = (e, formValidFields, passwordErrorMessage) => {
  formValidFields.isPasswordError = false;
  passwordErrorMessage.textContent = '';

  e.target.value = e.target.value.replace(/ /g, '');
  const value = e.target.value;

  if (!value) {
    passwordErrorMessage.textContent = messages.required;
    formValidFields.isPasswordError = true;
    return;
  }

  if (REGEXES.LANG.test(value)) {
    passwordErrorMessage.textContent = 'Only Latin characters are allowed.';
    formValidFields.isPasswordError = true;

    return;
  }

  if (value.length < 8) {
    passwordErrorMessage.textContent = 'Must be minimum 8 symbols';
    formValidFields.isPasswordError = true;

    return;
  }

  if (value.length > 16) {
    passwordErrorMessage.textContent = 'Must be no more then 16 symbols';
    formValidFields.isPasswordError = true;

    return;
  }
};
