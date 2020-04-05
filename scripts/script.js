//Observe changes
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in.
    //   let displayName = user.displayName;
    let email = user.email;
    // alert("Hello " + email);
    //   let emailVerified = user.emailVerified;
    //   let photoURL = user.photoURL;
    //   let isAnonymous = user.isAnonymous;
    //   let uid = user.uid;
    //   let providerData = user.providerData;
  } else {
    window.location.href = "file:///F:/DILYA/ClientList/login.html";

    // User is signed out.
    // ...
  }
});

const newClientForm = document.querySelector("#newClientForm");

newClientForm.addEventListener("submit", event => {
  event.preventDefault();
  addClient(event.target);
});

function displayData(clientsList = clients) {
  clearList();
  const ul = document.querySelector("#clientsData");
  clientsList.forEach(client => {
    ul.appendChild(getLiElement(client));
  });
  sumAmount(clientsList);
}

function getLiElement(client) {
  const newLi = document.createElement("li");
  const avatar = document.createElement("img");
  newLi.className = "media";

  avatar.className = "mr-3 align-self-center";
  avatar.setAttribute("src", client.avatar);

  newLi.appendChild(avatar);
  newLi.appendChild(createClientDescription(client));
  return newLi;
}

function createClientDescription(client) {
  const div = document.createElement("div");
  div.className = "media-body";

  const mailLink = document.createElement("a");
  mailLink.setAttribute("href", `mailto:${client.email}`);
  mailLink.innerHTML = client.email;
  const textPart1 = document.createTextNode(
    `${client.lastName} ${client.firstName} - `
  );
  const textPart2 = document.createTextNode(
    ` ${client.gender} (${client.date} - ${client.amount})`
  );
  div.appendChild(textPart1);
  div.appendChild(mailLink);
  div.appendChild(textPart2);

  return div;
}

function sortList(order) {
  const sortedClients = clients.sort((lastClient, nextClient) => {
    if (order == "ascending") {
      return lastClient.lastName > nextClient.lastName ? 1 : -1;
    } else {
      return lastClient.lastName < nextClient.lastName ? 1 : -1;
    }
  });
  refreshData(sortedClients);
}

function refreshData(updatedClients) {
  clearList();
  displayData(updatedClients);
}

function clearList() {
  const ul = document.querySelector("#clientsData");
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
}

function filterList() {
  const filterString = document
    .querySelector("#filterInput")
    .value.toLowerCase()
    .trim();
  if (filterString) {
    const filteredClients = clients.filter(client => {
      return (
        client.firstName.toLowerCase().includes(filterString) ||
        client.lastName.toLowerCase().includes(filterString) ||
        client.email.toLowerCase().includes(filterString) ||
        client.gender.toLowerCase().includes(filterString)
      );
    });
    refreshData(filteredClients);
    resultOfFilter(filteredClients);
    //   filteredClients.length === 0
    //     ? showNotFoundSection()
    //     : showResultListSection();
  } else {
    refreshData(clients);
  }
}

function sumAmount(clientsList = clients) {
  const total = clientsList.reduce((amount, client) => {
    return amount + removeCurrencyFromAmount(client.amount);
  }, 0);
  document.querySelectorAll(".totalAmountContainer").forEach(element => {
    element.innerHTML = total.toFixed(2);
  });
}

function removeCurrencyFromAmount(amount) {
  return amount ? Number(amount.slice(1)) : 0;
}

// function showNotFoundSection() {
//   document.querySelector(".resultList").style.display = "none";
//   document.querySelector(".notFound").style.display = "block";
// }

// function showResultListSection() {
//   document.querySelector(".resultList").style.display = "block";
//   document.querySelector(".notFound").style.display = "none";
// }

function resultOfFilter(filteredClients) {
  if (filteredClients.length === 0) {
    document.querySelector(".resultList").style.display = "none";
    document.querySelector(".notFound").style.display = "block";
  } else {
    document.querySelector(".resultList").style.display = "block";
    document.querySelector(".notFound").style.display = "none";
  }
}

function addClient(form) {
  const data = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    gender: form.gender.value,
    amount: form.amount.value,
    date: form.date.value,
    avatar: form.photo.value
  };
  console.log(data);
  const newId = database
    .ref()
    .child("clients")
    .push().key;
  let updates = {};
  updates[`clients/${newId}`] = data;
  database.ref().update(updates, function(error) {
    if (error) {
      console.error("New client was not added! Error occured!");
    } else {
      console.log("Data added to database!");
    }
  });
}

function logOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.

      window.location.href = "file:///F:/DILYA/ClientList/login.html";
    })
    .catch(function(error) {
      // An error happened.
      console.error(error);
    });
}

function hideModal() {
  const modalClose = document.querySelector("#modal");
  modalClose.style.display = "none";
}
