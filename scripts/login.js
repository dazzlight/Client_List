let state = "login";

const registerForm = document.querySelector("[name='registerForm']");

registerForm.addEventListener("submit", event => {
  event.preventDefault();
  validateRegisterForm(event.target);
});

const loginForm = document.querySelector("[name='loginForm']");

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  validateLoginForm(event.target);
});

togleStatus(state);

//Observe changes
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in.
    //   let displayName = user.displayName;
    let email = user.email;
    window.location.href = "file:///F:/DILYA/ClientList/index.html";
    //   let emailVerified = user.emailVerified;
    //   let photoURL = user.photoURL;
    //   let isAnonymous = user.isAnonymous;
    //   let uid = user.uid;
    //   let providerData = user.providerData;
  } else {
    // User is signed out.
    // ...
  }
});

//Validation
registerForm
  .querySelector('[type="password"]')
  .addEventListener("blur", event => {
    console.log(event.target);
    validatePassword(event.target);
  });

function showRegister() {
  registerForm.style.display = "block";
  loginForm.style.display = "none";
}

function showLogin() {
  loginForm.style.display = "block";
  registerForm.style.display = "none";
}

function togleStatus(newState) {
  state = newState;
  state === "login" ? showLogin() : showRegister();
}

function validateRegisterForm(target) {
  validatePassword(target.pass);
  registerNewUser(target.email.value, target.pass.value);
}

function validateLoginForm(target) {
  // validatePassword(target.pass);
  logIn(target.email.value, target.pass.value);
}

function validatePassword(field) {
  if (field.value.length < 10) {
    field.className += " is-invalid";
    console.error("Your pass is too weak!");
  } else {
    field.className = "form-control is-valid";
  }
}

function registerNewUser(email, password) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(response => console.log("Registered new user", response))
    .catch(error => handleError(error));
}

function logIn(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(response => console.log(`Hello ${response.user.email}`, response))
    .catch(error => handleError(error));
}

function handleError(error) {
  alert(`Error! ${error.code} - ${error.message}`);
}
