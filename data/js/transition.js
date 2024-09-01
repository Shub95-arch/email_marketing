const tabs = document.querySelectorAll('.sidebar-menu ul li a');

const activeTab = localStorage.getItem('activeTab');
if (activeTab) {
  const savedTab = document.querySelector(`a[href="${activeTab}"]`);
  if (savedTab) {
    savedTab.classList.add('active');
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', function (e) {
    tabs.forEach((link) => link.classList.remove('active'));

    this.classList.add('active');

    // Save in localStorage
    localStorage.setItem('activeTab', this.getAttribute('href'));
  });
});
