const cnahgeLangBtn = document.querySelector('.lang');

const changeLanguage = async (lang) => {
  await fetch('/change_lang', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lang }),
  });
};

cnahgeLangBtn.addEventListener('click', (e) => {
  try {
    const lang = e.target.dataset.lang;
    if (lang) {
      changeLanguage(lang);
      window.location.reload();
    }
  } catch (error) {
    console.log(error.message);
  }
});
