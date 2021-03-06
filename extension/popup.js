const favoriteBtn = document.getElementById('save-page-btn')
const pageSavedMessage = document.getElementById('page-saved-message')
const loginForm = document.getElementById('auth-form')
const userName = document.getElementById('username')
const password = document.getElementById('password')
const loginErrorMessage = document.getElementById('login-error-message')
const loginInfo = document.getElementById('login-info')
const support = {
  bbc: true,
  foxnews: true,
  huffpost: true,
  npr: true
}

checkLoginStatus()

let url, site, com
chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  url = tabs[0].url
  site = url.split('.')[1]
  com = url.split('.')[2].split('/')[0]
  chrome.tabs.executeScript(tabs[0].id, {
    code: `console.log(${tabs})`
  })
})

favoriteBtn.addEventListener('click', function(event) {
  event.preventDefault()
  fetch('http://localhost:8080/auth/me', {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  }).then(res =>
    res.json().then(user =>
      fetch('http://localhost:8080/api/favoriteSite', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: `${user.id}`,
          url: `https://www.${site}.${com}/`
        })
      })
    )
  )

  loginInfo.innerHTML = `<p>You are now subcribed to ${site}'s latest stories!</p>`
})

loginForm.addEventListener('submit', function(event) {
  event.preventDefault()
  fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: userName.value,
      password: password.value
    })
  })
    .then(response => {
      if (response.status === 401) {
        loginErrorMessage.innerText = 'wrong username and/or password'
      } else {
        checkLoginStatus()
      }
    })
    .catch(error => {
      loginErrorMessage.innerText = 'Login request failed: ' + error
    })
  loginForm.reset()
})

function checkLoginStatus() {
  fetch('http://localhost:8080/auth/me', {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
    .then(response => {
      if (response.status === 200) {
        response.json().then(() => {
          const logoutButton = document.createElement('button')
          logoutButton.innerText = 'logout'
          if (support[site]) {
            favoriteBtn.disabled = false
          } else {
            favoriteBtn.disabled = true
          }
          logoutButton.onclick = function() {
            fetch('http://localhost:8080/auth/logout', {
              method: 'POST',
              mode: 'cors',
              credentials: 'include'
            })
              .then(() => {
                location.reload()
              })
              .catch(error => {
                console.error(error)
              })
          }
          loginInfo.innerHTML = `<p>Stay up to date with ${site}'s latest stories<p>`
          loginInfo.appendChild(logoutButton)
        })
      }
    })
    .catch(error => {
      console.error(error)
    })
}
