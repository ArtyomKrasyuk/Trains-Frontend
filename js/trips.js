const availabilityPanel = document.querySelector('.availability-panel');
const availabilityIcon = document.querySelector('.availability-icon');

function toggleIcon() {
  if (availabilityIcon.src.includes('img/Done1.png')) {
    availabilityIcon.src = 'img/Unavailable1.png';
  } else {
    availabilityIcon.src = 'img/Done1.png';
  }
}

availabilityPanel.addEventListener('click', toggleIcon);

document.addEventListener('DOMContentLoaded', () => {
  const selectWrapper = document.querySelector('.custom-select');
  const trigger = selectWrapper.querySelector('.custom-select-trigger');
  const options = selectWrapper.querySelector('.custom-options');
  const allOptions = options.querySelectorAll('.custom-option');

  trigger.addEventListener('click', () => {
    options.style.display = options.style.display === 'flex' ? 'none' : 'flex';
  });

  allOptions.forEach(option => {
    option.addEventListener('click', () => {
      trigger.textContent = option.textContent;
      trigger.setAttribute('data-value', option.getAttribute('data-value'));
      options.style.display = 'none';
      allOptions.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');
    });
  });

  document.addEventListener('click', e => {
    if (!selectWrapper.contains(e.target)) {
      options.style.display = 'none';
    }
  });
});