const showNotification = (type, text, time = 3000) => {
  const popupNotification = document.getElementById('snackbar');
  popupNotification.innerHTML = text;
  popupNotification.className = 'show';
  setTimeout(function() {
    popupNotification.classList.remove('show');
  }, time);
};

export { showNotification };
