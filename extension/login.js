document.getElementById('submit').addEventListener('click', validate)
function validate() {
  var email = document.getElementById('email').value
  var password = document.getElementById('password').value
  fetch('https://localhost/8080/auth/login', {
    method: 'post',
    mode: 'cors',
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email, password})
  }).then(res => checkstatus(res))
}
function checkstatus(res) {
  if (res.status === 401) {
    document.write('<html><body><p>Wrong login<p></body></html>')
  } else {
    document.write('<html><body><p>Welcome<p></body></html>')
  }
}
