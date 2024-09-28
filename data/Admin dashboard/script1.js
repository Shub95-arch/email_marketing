// Get all the menu items (tabs)
const tabs = document.querySelectorAll('.sidebar-menu ul li a');

// Loop through each tab and add a click event listener
tabs.forEach((tab) => {
  tab.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default link behavior

    // Remove the 'active' class from all tabs
    tabs.forEach((link) => link.classList.remove('active'));

    // Add the 'active' class to the clicked tab
    this.classList.add('active');
  });
});
