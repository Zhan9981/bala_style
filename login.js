document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: form.email.value,
      password: form.password.value
    })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem('token', data.token);
    if (res.ok) {
  localStorage.setItem('token', data.token);
  window.location.href = '/products.html'; // ← тек бір жол қалсын
}

  } else {
    alert(data.error);
  }
});
