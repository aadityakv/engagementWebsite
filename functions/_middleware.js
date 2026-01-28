// Cloudflare Pages Middleware for Password Protection
// Set SITE_PASSWORD as an environment variable (secret) in Cloudflare Pages dashboard
// Set BYPASS_TOKEN as an environment variable (secret) for magic link bypass

const AUTH_COOKIE_NAME = 'site_authenticated';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Generate the password page HTML
function getPasswordPageHTML(error = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sneha & Aaditya - Enter Password</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh;
      background: linear-gradient(180deg, #6B2D5C 0%, #8B4A7A 40%, #A67B9E 70%, #C4A5C0 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 24px;
      font-family: Georgia, serif;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 48px 40px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      font-family: 'Great Vibes', cursive;
      font-size: 48px;
      color: #6B2D5C;
      margin-bottom: 8px;
      font-weight: normal;
    }
    .subtitle {
      font-family: 'Cormorant Garamond', Georgia;
      font-size: 18px;
      color: #C9A227;
      margin-bottom: 32px;
    }
    .divider {
      width: 60px;
      height: 2px;
      background: linear-gradient(90deg, #C9A227, #2A9D8F);
      margin: 0 auto 32px;
    }
    .message {
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;
      color: #2D2D2D;
      margin-bottom: 24px;
      line-height: 1.6;
    }
    input[type="password"] {
      width: 100%;
      padding: 14px 16px;
      border-radius: 10px;
      border: 1px solid #E8D5F2;
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;
      margin-bottom: 16px;
      transition: all 0.3s;
    }
    input[type="password"]:focus {
      outline: none;
      border-color: #2A9D8F;
      box-shadow: 0 0 0 3px rgba(42,157,143,0.1);
    }
    .error {
      color: #d32f2f;
      font-family: 'Montserrat', sans-serif;
      font-size: 13px;
      margin-bottom: 16px;
    }
    button {
      width: 100%;
      padding: 14px 48px;
      border: none;
      background: linear-gradient(135deg, #C9A227, #6B2D5C);
      color: white;
      font-family: 'Montserrat', sans-serif;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 2px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s;
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(201,162,39,0.3);
    }
    .footer {
      font-family: 'Montserrat', sans-serif;
      font-size: 12px;
      color: rgba(255,255,255,0.7);
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Sneha & Aaditya</h1>
    <p class="subtitle">Engagement Celebration</p>
    <div class="divider"></div>
    <p class="message">
      This website is for invited guests only.<br>
      Please enter the password to continue.
    </p>
    <form method="POST" action="/__auth">
      <input type="password" name="password" placeholder="Enter password" autofocus required>
      ${error ? `<p class="error">${error}</p>` : ''}
      <button type="submit">ENTER</button>
    </form>
  </div>
  <p class="footer">Don't have the password? Reach out to Sneha or Aaditya!</p>
</body>
</html>`;
}

// Check if user is authenticated via cookie
function isAuthenticated(request, env) {
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [key, ...val] = c.trim().split('=');
      return [key, val.join('=')];
    })
  );

  // Cookie value should match a hash of the password to prevent tampering
  const expectedValue = btoa(env.SITE_PASSWORD || 'default');
  return cookies[AUTH_COOKIE_NAME] === expectedValue;
}

// Create authentication cookie
function createAuthCookie(env) {
  const value = btoa(env.SITE_PASSWORD || 'default');
  return `${AUTH_COOKIE_NAME}=${value}; Path=/; Max-Age=${AUTH_COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Strict`;
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Handle bypass token (magic link)
  // Usage: Add ?access=YOUR_BYPASS_TOKEN to any URL
  const bypassToken = url.searchParams.get('access');
  if (bypassToken && env.BYPASS_TOKEN && bypassToken === env.BYPASS_TOKEN) {
    // Valid bypass token - set cookie and redirect to same page without token
    url.searchParams.delete('access');
    return new Response(null, {
      status: 302,
      headers: {
        'Location': url.pathname + (url.search || ''),
        'Set-Cookie': createAuthCookie(env)
      }
    });
  }

  // Handle authentication POST
  if (url.pathname === '/__auth' && request.method === 'POST') {
    const formData = await request.formData();
    const password = formData.get('password');

    if (password === (env.SITE_PASSWORD || 'default')) {
      // Password correct - set cookie and redirect to home
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/',
          'Set-Cookie': createAuthCookie(env)
        }
      });
    } else {
      // Wrong password - show error
      return new Response(getPasswordPageHTML('Incorrect password. Please try again.'), {
        status: 401,
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }

  // Check if already authenticated
  if (isAuthenticated(request, env)) {
    return next();
  }

  // Not authenticated - show password page
  return new Response(getPasswordPageHTML(), {
    status: 401,
    headers: { 'Content-Type': 'text/html' }
  });
}
