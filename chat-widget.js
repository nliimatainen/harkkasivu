(function() {
  // Chat widget for Digivoitto
  var isOpen = false;

  // Create styles
  var style = document.createElement('style');
  style.textContent = [
    '.dv-chat-btn{position:fixed;bottom:24px;right:24px;width:60px;height:60px;border-radius:50%;background:#0066CC;color:#fff;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(0,102,204,0.4);z-index:10000;display:flex;align-items:center;justify-content:center;transition:transform 0.3s,box-shadow 0.3s}',
    '.dv-chat-btn:hover{transform:scale(1.1);box-shadow:0 6px 20px rgba(0,102,204,0.5)}',
    '.dv-chat-btn svg{width:28px;height:28px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '.dv-chat-panel{position:fixed;bottom:96px;right:24px;width:360px;max-width:calc(100vw - 32px);background:#fff;border-radius:12px;box-shadow:0 8px 40px rgba(0,0,0,0.15);z-index:10000;overflow:hidden;display:none;font-family:"Open Sans",sans-serif;animation:dvSlideUp 0.3s ease}',
    '@keyframes dvSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}',
    '.dv-chat-header{background:#0066CC;color:#fff;padding:12px 20px;display:flex;align-items:center;justify-content:space-between}',
    '.dv-chat-header img{height:40px;width:auto}',
    '.dv-chat-close{background:none;border:none;color:#fff;cursor:pointer;font-size:24px;line-height:1;padding:0 4px;opacity:0.8;transition:opacity 0.2s}',
    '.dv-chat-close:hover{opacity:1}',
    '.dv-chat-body{padding:20px}',
    '.dv-chat-body p{font-size:14px;color:#555;margin:0 0 16px;line-height:1.6}',
    '.dv-chat-field{margin-bottom:14px}',
    '.dv-chat-field label{display:block;font-size:13px;font-weight:600;color:#0B2545;margin-bottom:4px;font-family:"Montserrat",sans-serif}',
    '.dv-chat-field input,.dv-chat-field textarea{width:100%;padding:10px 12px;border:1px solid #E0E0E0;border-radius:6px;font-size:14px;font-family:"Open Sans",sans-serif;transition:border-color 0.3s;box-sizing:border-box}',
    '.dv-chat-field input:focus,.dv-chat-field textarea:focus{outline:none;border-color:#0066CC;box-shadow:0 0 0 3px rgba(0,102,204,0.1)}',
    '.dv-chat-field textarea{resize:none;min-height:80px}',
    '.dv-chat-submit{width:100%;padding:12px;background:#0066CC;color:#fff;border:none;border-radius:6px;font-size:15px;font-weight:600;font-family:"Montserrat",sans-serif;cursor:pointer;transition:background 0.3s}',
    '.dv-chat-submit:hover{background:#0052a3}',
    '.dv-chat-submit:disabled{opacity:0.6;cursor:not-allowed}',
    '.dv-chat-error{background:#FEE2E2;color:#991B1B;padding:8px 12px;border-radius:6px;font-size:13px;margin-bottom:14px}',
    '.dv-chat-success{text-align:center;padding:30px 20px}',
    '.dv-chat-success svg{width:48px;height:48px;margin:0 auto 16px;display:block}',
    '.dv-chat-success h3{color:#166534;font-family:"Montserrat",sans-serif;font-size:18px;margin:0 0 8px}',
    '.dv-chat-success p{color:#555;font-size:14px;margin:0;line-height:1.6}',
    '@media(max-width:480px){.dv-chat-panel{bottom:0;right:0;left:0;width:100%;max-width:100%;border-radius:12px 12px 0 0;max-height:85vh;overflow-y:auto}}'
  ].join('\n');
  document.head.appendChild(style);

  // Create floating button
  var btn = document.createElement('button');
  btn.className = 'dv-chat-btn';
  btn.setAttribute('aria-label', 'Avaa chat');
  btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  document.body.appendChild(btn);

  // Create chat panel
  var panel = document.createElement('div');
  panel.className = 'dv-chat-panel';
  panel.innerHTML = [
    '<div class="dv-chat-header">',
    '  <img src="logo-2-arrow-white.svg" alt="Digivoitto">',
    '  <button class="dv-chat-close" aria-label="Sulje">&times;</button>',
    '</div>',
    '<div class="dv-chat-body" id="dvChatBody">',
    '  <p>Hei! Kerro lyhyesti, miten voimme auttaa, niin palaamme asiaan pian.</p>',
    '  <div id="dvChatError" class="dv-chat-error" style="display:none"></div>',
    '  <form id="dvChatForm">',
    '    <div class="dv-chat-field">',
    '      <label for="dvName">Nimi</label>',
    '      <input type="text" id="dvName" placeholder="Nimesi">',
    '    </div>',
    '    <div class="dv-chat-field">',
    '      <label for="dvEmail">Sähköposti *</label>',
    '      <input type="email" id="dvEmail" placeholder="sahkoposti@yritys.fi" required>',
    '    </div>',
    '    <div class="dv-chat-field">',
    '      <label for="dvPhone">Puhelin</label>',
    '      <input type="tel" id="dvPhone" placeholder="040 XXX XXXX">',
    '    </div>',
    '    <div class="dv-chat-field">',
    '      <label for="dvMessage">Viesti *</label>',
    '      <textarea id="dvMessage" placeholder="Kerro lyhyesti tarpeestasi..." required></textarea>',
    '    </div>',
    '    <button type="submit" class="dv-chat-submit">Lähetä viesti</button>',
    '  </form>',
    '</div>'
  ].join('\n');
  document.body.appendChild(panel);

  function toggleChat() {
    isOpen = !isOpen;
    panel.style.display = isOpen ? 'block' : 'none';
    btn.innerHTML = isOpen
      ? '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
      : '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  }

  btn.addEventListener('click', toggleChat);
  panel.querySelector('.dv-chat-close').addEventListener('click', toggleChat);

  // Form submit
  var form = panel.querySelector('#dvChatForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var errEl = panel.querySelector('#dvChatError');
    var email = panel.querySelector('#dvEmail').value.trim();
    var message = panel.querySelector('#dvMessage').value.trim();

    if (!email || !message) {
      errEl.textContent = 'Täytä sähköposti ja viesti.';
      errEl.style.display = 'block';
      return;
    }

    errEl.style.display = 'none';
    var submitBtn = form.querySelector('.dv-chat-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Lähetetään...';

    // Show success after brief delay (static site - no backend)
    setTimeout(function() {
      var body = panel.querySelector('#dvChatBody');
      body.innerHTML = [
        '<div class="dv-chat-success">',
        '  <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="9 12 12 15 16 10"></polyline></svg>',
        '  <h3>Kiitos viestistäsi!</h3>',
        '  <p>Olemme vastaanotetaneet viestisi ja palaamme asiaan mahdollisimman pian.</p>',
        '</div>'
      ].join('');
    }, 800);
  });
})();
