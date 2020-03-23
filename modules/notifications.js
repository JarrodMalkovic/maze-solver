//Notication System
const showNotification = (type, text, time = 3000) => {
  // Get the snackbar DIV
  const popupNotifcation = document.getElementById('snackbar');
  popupNotifcation.innerHTML = text;
  // Add the "show" class to DIV
  popupNotifcation.className = 'show';

  // After 3 seconds, remove the show class from DIV
  setTimeout(function() {
    popupNotifcation.classList.remove('show');
  }, time);
};

export { showNotification };
