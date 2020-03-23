const showNotification = (type, text, time = 3000) => {
  const popupNotifcation = document.getElementById('snackbar');
  popupNotifcation.innerHTML = text;
  popupNotifcation.className = 'show';
  setTimeout(function() {
    popupNotifcation.classList.remove('show');
  }, time);
};

export { showNotification };
