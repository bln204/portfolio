/**
 * contact.js - Contact Form Validation, Toast Notifications & Copy Actions
 */

// Toast notification helper (styled as a VS Code notification popup)
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `vsc-toast${type === 'error' ? ' error' : type === 'success' ? ' success' : ''}`;

  const iconName = type === 'error' ? 'alert-circle' : type === 'success' ? 'check-circle-2' : 'info';

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <span>${message}</span>
    <button class="toast-close" aria-label="Đóng"><i data-lucide="x" style="width:14px;height:14px;"></i></button>
  `;

  container.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  const dismiss = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  };
  const closeBtn = toast.querySelector('.toast-close');
  if (closeBtn) closeBtn.addEventListener('click', dismiss);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 50);

  // Auto remove after 4 seconds
  setTimeout(dismiss, 4000);
}

// Copy helper
function copyToClipboard(text, label = 'nội dung') {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Đã sao chép ${label}: ${text}`, 'success');
  }).catch(() => {
    showToast(`Không thể sao chép ${label}. Vui lòng thử lại!`, 'error');
  });
}

// Contact form handler
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');

  document.querySelectorAll('.copy-btn[data-copy], #copy-email-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const text = btn.getAttribute('data-copy') || btn.getAttribute('data-email') || 'lenambui3@gmail.com';
      const label = btn.getAttribute('data-label') || 'Email';
      copyToClipboard(text, label);
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('sender-name');
      const emailInput = document.getElementById('sender-email');
      const subjectInput = document.getElementById('sender-subject');
      const messageInput = document.getElementById('sender-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput ? subjectInput.value.trim() : 'Liên hệ từ Portfolio';
      const message = messageInput.value.trim();

      // Basic validation
      if (!name || !email || !message) {
        showToast('Vui lòng điền đầy đủ tất cả các trường bắt buộc!', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast('Vui lòng nhập định dạng email hợp lệ!', 'error');
        return;
      }

      // Simulate sending with loading state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spin" style="width:15px;height:15px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle style="opacity:.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path style="opacity:.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Đang gửi tin nhắn...</span>
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        showToast('Cảm ơn bạn! Tin nhắn đã được gửi thành công. Tôi sẽ phản hồi sớm nhất có thể.', 'success');
      }, 1200);
    });
  }
});
