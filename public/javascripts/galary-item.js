const mainImg = document.querySelector('.goods-mean-image');
const galary = document.querySelector('.galary-wrap');
const galeryImg = galary.querySelectorAll('.galery-img');

galary.addEventListener('click', (e) => {
  const target = e.target.closest('.galery-img');

  if (target) {
    galeryImg.forEach((img) => img.classList.remove('border'));
    target.classList.add('border');

    mainImg.src = target.firstElementChild.src;
  }
});
