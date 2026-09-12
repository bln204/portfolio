/**
 * main.js - Portfolio feature logic: project filter, interactive terminal,
 * and animated stats counter. IDE shell (tabs/sidebar/theme/palette) lives
 * in ide.js.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProjectFilter();
  initInteractiveTerminal();
  initStatsCounter();
});

/* ==========================================================================
   1. Projects Category Filter
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const cardCategories = card.getAttribute('data-category') || '';
        if (category === 'all' || cardCategories.includes(category)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   2. Interactive Developer Terminal Widget
   ========================================================================== */
function initInteractiveTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminalBody');

  if (!terminalInput || !terminalOutput) return;

  const commands = {
    help: `
      <div class="t-accent" style="margin-bottom:4px;">Các lệnh có sẵn:</div>
      <div class="term-help-grid">
        <div><span class="t-success">about</span> — Xem tóm tắt thông tin cá nhân</div>
        <div><span class="t-success">skills</span> — Danh sách công nghệ thành thạo</div>
        <div><span class="t-success">projects</span> — Điểm danh dự án tiêu biểu</div>
        <div><span class="t-success">education</span> — Lộ trình học vấn và GPA</div>
        <div><span class="t-success">contact</span> — Thông tin liên hệ nhanh</div>
        <div><span class="t-success">socials</span> — Các đường link mạng xã hội</div>
        <div><span class="t-success">sudo hire</span> — Nhận lời mời làm việc / Thực tập</div>
        <div><span class="t-success">clear</span> — Xóa sạch màn hình terminal</div>
      </div>
    `,
    about: `
      <div>
        <span class="t-success">Tên:</span> Bùi Lê Nam (Sinh viên CNTT)<br/>
        <span class="t-success">Mục tiêu:</span> Trở thành Full-Stack Software Engineer xuất sắc, xây dựng các sản phẩm thực tế có giá trị cao.<br/>
        <span class="t-success">Điểm mạnh:</span> Tư duy giải quyết vấn đề, tự học nhanh và kỷ luật cao.
      </div>
    `,
    skills: `
      <div>
        <div><span class="t-accent">Frontend:</span> HTML5, CSS3, JavaScript (ES6+), React.js, Tailwind CSS, TypeScript</div>
        <div><span class="t-accent">Database:</span> MongoDB, PostgreSQL, MySQL, Redis</div>
        <div><span class="t-accent">DevOps & Tools:</span> Git, GitHub, Docker, Postman, Linux, Figma</div>
      </div>
    `,
    projects: `
      <div>
        <div>1. <span class="t-accent">AI Agent</span> — Trợ lý tài liệu doanh nghiệp theo kiến trúc RAG (Spring AI, Gemini, Qdrant) — Full-Stack</div>
        <div>2. <span class="t-accent">HJhaju Web</span> — Nền tảng đọc truyện online — đảm nhận Auth & bình luận realtime qua WebSocket</div>
        <div>3. <span class="t-accent">Casestudy M4</span> — Website bán quần áo (Spring Boot + Thymeleaf) — Full-Stack</div>
      </div>
    `,
    education: `
      <div>
        <div>🎓 <span class="t-accent">Đại học:</span> Cử nhân Công nghệ Thông tin - Đại học Văn Hiến (2022 - 2026)</div>
        <div>📈 <span class="t-success">GPA tích lũy:</span> 3.02 / 4.00</div>
        <div>📜 <span class="t-warn">2023:</span> Chứng chỉ Java Bootcamp Developer (CodeGym Vietnam)</div>
        <div>💻 <span class="t-accent">2024:</span> Xây dựng E-Commerce Case Study & Realtime WebSocket</div>
        <div>🤖 <span class="t-accent">2026:</span> Đồ án tốt nghiệp: Hệ thống AI Agent doanh nghiệp (RAG)</div>
      </div>
    `,
    contact: `
      <div>
        <div>📧 Email: <a href="mailto:lenambui3@gmail.com" class="t-accent">lenambui3@gmail.com</a></div>
        <div>📱 Phone: +84 (0) 394 786 578</div>
        <div>📍 Vị trí: TP. Hồ Chí Minh, Việt Nam</div>
      </div>
    `,
    socials: `
      <div>
        <div>🐙 GitHub: <a href="https://github.com/bln204" target="_blank" class="t-accent">github.com/bln204</a></div>
        <div>💼 LinkedIn: <a href="https://www.linkedin.com/in/nam-l%C3%AA-1ab646434/" target="_blank" class="t-accent">linkedin.com/in/nam-lê</a></div>
        <div>✈️ Telegram: <a href="https://t.me/namlb_09" target="_blank" class="t-accent">t.me/namlb_09</a></div>
        <div>💬 Zalo: <a href="https://zalo.me/0394786578" target="_blank" class="t-accent">zalo.me/0394786578</a></div>
      </div>
    `,
    'sudo hire': `
      <div class="t-success" style="font-weight:700;">
        🚀 [PERMISSION GRANTED] Tuyệt vời! Tôi luôn sẵn sàng gia nhập đội ngũ của bạn ở vị trí Thực tập sinh / Junior Developer.<br/>
        Vui lòng liên hệ trực tiếp qua Email hoặc tab contact.js!
      </div>
    `,
    whoami: `<div class="t-accent">visitor@portfolio-guest</div>`,
    date: `<div>${new Date().toLocaleString('vi-VN')}</div>`,
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const inputVal = terminalInput.value.trim().toLowerCase();
      if (!inputVal) return;

      if (inputVal === 'clear') {
        terminalOutput.innerHTML = '';
        terminalInput.value = '';
        return;
      }

      const line = document.createElement('div');
      line.innerHTML = `
        <div class="term-history-cmd">
          <span class="t-success" style="font-weight:700;">visitor@dev:~$</span>
          <span>${terminalInput.value}</span>
        </div>
      `;

      const responseDiv = document.createElement('div');
      responseDiv.className = 'term-response';
      responseDiv.innerHTML = commands[inputVal]
        || `<span class="t-danger">Lệnh không hợp lệ: "${inputVal}". Gõ <span class="t-success" style="font-weight:700;">help</span> để xem danh sách lệnh.</span>`;

      line.appendChild(responseDiv);
      terminalOutput.appendChild(line);

      terminalInput.value = '';
      if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });
}

/* ==========================================================================
   3. Animated Stats Counter
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-count');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseFloat(stat.getAttribute('data-target'));
          const isDecimal = target % 1 !== 0;
          const duration = 1800;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              stat.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
              clearInterval(timer);
            } else {
              stat.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.getElementById('stats');
  if (statsSection) observer.observe(statsSection);
}
