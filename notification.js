function showNotification(type) {
  const container = document.getElementById('notification-container');
  const notification = document.createElement('div');
  notification.classList.add('notification', type);

  let message = '';
  switch (type) {
    case 'success': message = '✅ Operation Successful!'; break;
    case 'error': message = '❌ Something went wrong!'; break;
    case 'info': message = 'ℹ️ Just so you know...'; break;
    case 'warning': message = '⚠️ Please be careful!'; break;
  }

  notification.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">✖</button>
  `;

  container.appendChild(notification);

  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.remove();
  }, 4000);
}
