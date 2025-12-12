import { nanoid } from 'nanoid'

// Maximum size of a value payload, just in case. In bytes.
const MAX_DATA_SIZE = 32768;

// Cloudflare's turnstile secret key
const TURNSTILE_SECRET_ENV_VAR = "state-of-the-developer-ecosystem-2025-turnstile";

export async function onRequestPost(context) {
  try {
    // 1. Extract and 'validate' data
    const [challenge, data] = await json(context);
    if (!data) {
      console.error('invalid survey data');
      return new Response('invalid survey data', { status: 400 });
    }

    console.log(context.env[TURNSTILE_SECRET_ENV_VAR]);
    console.log(context.env);

    // 2. Verify the turnstile challenge
    const ip = context.request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';
    const validation = await validateTurnstile(
      context.env[TURNSTILE_SECRET_ENV_VAR],
      challenge,
      ip,
    );
    if (!validation.success) {
      console.error('invalid challenge:', validation['error-codes']);
      return new Response('invalid turnstile verification', { status: 400 });
    }

    // 3. Store the result
    const task = await context.env.kv.put(nanoid(), data);
    return new Response(task);
  } catch (err) {
    console.error(`failed to store response: ${err}`);
    return new Response(`failed to store response`, { status: 500 });
  }
}

async function json(context) {
  const body = await context.request.json();

  if (typeof body !== 'object' || body === null) {
    console.error('empty or malformed payload');
    return null;
  }

  const data = JSON.stringify(body.data);

  if (data.length > MAX_DATA_SIZE) {
    console.error('data too large');
    return null;
  }


  return [body.challenge, data];
}

async function validateTurnstile(secret, challenge, remoteip) {
  const formData = new FormData();
  formData.append('secret', secret);
  formData.append('response', challenge);
  formData.append('remoteip', remoteip);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData
    });

    return response.json();
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return { success: false, 'error-codes': ['internal-error'] };
  }
}
