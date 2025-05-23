document.getElementById('registerForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;

  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: form.name.value,
      email: form.email.value,
      password: form.password.value
    })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Тіркелу сәтті аяқталды! Енді кіріңіз.');
    window.location.href = '/login.html';
  } else {
    alert(data.error);
  }
});
