const token = localStorage.getItem('token');
if (!token) {
  window.location.href = '/login.html';
} else {
  fetch('/api/products', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error('Токен жарамсыз немесе уақыты өтті');
      return res.json();
    })
    .then(data => {
      // Мұнда өнімдерді көрсету логикасы болады
      console.log(data);
    })
    .catch(err => {
      alert(err.message);
      window.location.href = '/login.html';
    });
}
