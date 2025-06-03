const loginForm = document.querySelector('.signUpForm');
const userExist = document.querySelector('.userExist');

const signUpUser = async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());

  if (!data.email.trim() || !data.password.trim()) {
    return;
  }

  try {
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.email.trim() || !data.password.trim()) {
      return;
    }

    const result = await fetch('/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!result.ok) {
      throw new Error(`Server error: ${result.status}`);
    }

    const res = await result.json();

    if (res.status === 409) {
      alert(res.message);
      return;
    }
    alert('You have registered successfully');
    window.location.href = '/login';
  } catch (error) {
    console.error('Request failed:', error.message);
  }
};

// loginForm.addEventListener('submit', signUpUser);
