document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.input-field');
  const toggleBtns = document.querySelectorAll('.toggle');
  const main = document.querySelector('main');
  const bullets = document.querySelectorAll('.bullets span');
  const images = document.querySelectorAll('.image');

  // Add event listeners for input fields to toggle active class
  inputs.forEach((input) => {
    input.addEventListener('focus', () => {
      input.classList.add('active');
    });
    input.addEventListener('blur', () => {
      if (input.value !== '') return;
      input.classList.remove('active');
    });
  });

  // Add event listeners to toggle between sign-in and sign-up forms
  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      main.classList.toggle('sign-up-mode');
    });
  });

  // Function to handle carousel image changes and text slider updates
  function moveSlider() {
    const index = this.dataset.value; // Get index from data-value attribute

    // Remove 'show' class from all images
    images.forEach((img) => img.classList.remove('show'));

    // Show the image corresponding to the clicked bullet
    const currentImage = document.querySelector(`.img-${index}`);
    if (currentImage) {
      currentImage.classList.add('show');
    }

    // Update the text slider based on the index
    const textSlider = document.querySelector('.text-group');
    if (textSlider) {
      textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
    }

    // Update bullets' active state
    bullets.forEach((bullet) => bullet.classList.remove('active'));
    this.classList.add('active');
  }

  // Add event listeners to bullets for manual control
  bullets.forEach((bullet) => {
    bullet.addEventListener('click', moveSlider);
  });

  // Automatic carousel movement
  let currentIndex = 1; // Starting index (e.g., 1)
  function autoSlide() {
    currentIndex = (currentIndex % bullets.length) + 1; // Loop back to start
    const nextBullet = document.querySelector(
      `.bullets span[data-value="${currentIndex}"]`
    );
    if (nextBullet) {
      moveSlider.call(nextBullet); // Call moveSlider with nextBullet as context
    }
  }

  setInterval(autoSlide, 3000); // Change slide every 3 seconds
});
