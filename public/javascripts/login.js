const loginForm = document.querySelector('.loginForm');

const loginUser = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    if (!data.email.trim() || !data.password.trim()) {
      return;
    }

    const result = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!result.ok) {
      throw new Error(`Server error: ${result.status}`);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
};

// const loginUser = async (e) => {
//   e.preventDefault();

//   try {
//     const formData = new FormData(loginForm);
//     const data = Object.fromEntries(formData.entries());

//     if (!data.email.trim() || !data.password.trim()) {
//       return;
//     }

//     const result = await fetch('/login', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify(data),
//     });

//     if (!result.ok) {
//       throw new Error(`Server error: ${result.status}`);
//     }

//     const res = await result.json();

//     if (res.token) {
//       localStorage.setItem('token', res.token);
//       window.location.href = '/';
//     } else {
//       console.error('Login error:', res.error);
//       alert(res.error);
//     }
//   } catch (error) {
//     console.error('Request failed:', error.message);
//   }
// };

// loginForm.addEventListener('submit', loginUser);
