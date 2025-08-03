const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

loginBtn.addEventListener('click', function(e) {
  e.preventDefault();
  auth('http://localhost:3000/login');
});

registerBtn.addEventListener('click', function(e) {
  e.preventDefault();
  auth('http://localhost:3000/register');

});

function auth(endpoint) {
  const email = emailInput.value;
  const password = passwordInput.value;

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials:'include',
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = './index.html';
      } else {
        alert(data.message || 'Authentication failed');
      }
    })
    .catch(err => alert('Error: ' + err));
}