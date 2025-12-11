// Standardized OAuth popup HTML generator

interface OAuthResultOptions {
  status: 'success' | 'error';
  providerName: string;
  message: string;
  autoCloseSeconds?: number;
}

export function generateOAuthResultHtml(options: OAuthResultOptions): string {
  const { status, providerName, message, autoCloseSeconds = 3 } = options;
  const bgColor = status === 'success' ? '#10B981' : '#EF4444';
  const icon = status === 'success' 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${providerName} Connection</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    .container {
      text-align: center;
      padding: 2.5rem;
      max-width: 420px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .icon {
      color: ${bgColor};
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: center;
    }
    .provider-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }
    p {
      color: rgba(255,255,255,0.7);
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    .btn {
      background: ${bgColor};
      color: white;
      border: none;
      padding: 0.875rem 2rem;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;
    }
    .btn:hover { 
      opacity: 0.9; 
      transform: translateY(-1px);
    }
    .countdown {
      margin-top: 1rem;
      font-size: 0.875rem;
      color: rgba(255,255,255,0.5);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="provider-badge">${providerName}</div>
    <div class="icon">${icon}</div>
    <h1>${status === 'success' ? 'Connected!' : 'Connection Failed'}</h1>
    <p>${message}</p>
    <button class="btn" onclick="closeAndRefresh()">
      Close Window
    </button>
    ${status === 'success' ? `<p class="countdown">Auto-closing in <span id="timer">${autoCloseSeconds}</span>s...</p>` : ''}
  </div>
  <script>
    function closeAndRefresh() {
      if (window.opener) {
        window.opener.postMessage({ type: 'oauth-complete', status: '${status}' }, '*');
        window.opener.location.reload();
      }
      window.close();
    }
    
    ${status === 'success' ? `
    let timeLeft = ${autoCloseSeconds};
    const timerEl = document.getElementById('timer');
    const countdown = setInterval(() => {
      timeLeft--;
      if (timerEl) timerEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(countdown);
        closeAndRefresh();
      }
    }, 1000);
    ` : ''}
  </script>
</body>
</html>`;
}
