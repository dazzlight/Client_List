//Observe changes
firebase.auth().onAuthStateChanged((user) => {
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

newClientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addClient(event.target);
  $("#addClientModal").modal("hide");
  return false;
});

const editClientForm = document.querySelector("#editClientForm");
editClientForm.addEventListener("submit", (event) => {
  event.preventDefault();
  editClient(event.target);
  $("#editClientModal").modal("hide");
  return false;
});

function displayData(clientsList = clients) {
  clearList();
  const ul = document.querySelector("#clientsData");
  for (const property in clientsList) {
    console.log(`${property}: ${clientsList[property]}`);
    ul.appendChild(getLiElement(clientsList[property], property));
  }
  sumAmount(clientsList);
}

function getLiElement(client, id) {
  const newLi = document.createElement("li");
  const avatar = document.createElement("img");
  newLi.className = "media";
  newLi.id = id;
  avatar.className = "mr-3 align-self-center";
  avatar.setAttribute("src", client.avatar);

  newLi.appendChild(avatar);
  newLi.appendChild(createClientDescription(client, id));
  return newLi;
}

function createClientDescription(client, id) {
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

  const deleteLink = document.createElement("a");
  deleteLink.innerHTML = "Delete";
  deleteLink.setAttribute("href", "#");
  deleteLink.classList.add("mx-2");
  deleteLink.addEventListener("click", (event) => {
    event.preventDefault();
    deleteClient(id);
  });

  const editLink = createEditLink(id);
  div.appendChild(textPart1);
  div.appendChild(mailLink);
  div.appendChild(textPart2);
  div.appendChild(editLink);
  div.appendChild(deleteLink);

  return div;
}

function createEditLink(id) {
  const editLink = document.createElement("a");
  editLink.innerHTML = "Edit";
  editLink.setAttribute("href", "#");
  editLink.setAttribute("data-toggle", "modal");
  editLink.setAttribute("data-target", "#editClientModal");
  editLink.setAttribute("data-client-id", id);
  editLink.classList.add("mx-2");
  editLink.classList.add("edit-client-link");
  editLink.addEventListener("click", (event) => {
    fillClientForm(id);
  });
  return editLink;
}

function fillClientForm(id) {
  if (editClientForm) {
    editClientForm.firstName.value = clients[id].firstName;
    editClientForm.lastName.value = clients[id].lastName;
    editClientForm.email.value = clients[id].email;
    editClientForm.gender.value = clients[id].gender;
    editClientForm.amount.value = clients[id].amount;
    editClientForm.date.value = clients[id].date;
    editClientForm.clientID.value = id;
  }
}

function editClient(form) {
  const data = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    email: form.email.value,
    gender: form.gender.value,
    amount: form.amount.value,
    date: form.date.value,
  };

  const id = form.clientID.value;
  let updates = {};
  updates[`clients/${id}`] = data;

  console.log("id", id, data);
  if (id) updateDB(updates);
}

function deleteClient(id) {
  console.log(id);
  const clientRef = database.ref(`clients/${id}`);
  clientRef.remove();
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
    const filteredClients = clients.filter((client) => {
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
  document.querySelectorAll(".totalAmountContainer").forEach((element) => {
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
    avatar: form.photo.value,
  };

  const newId = database.ref().child("clients").push().key;
  let updates = {};
  updates[`clients/${newId}`] = data;

  updateDB(updates);
}
function updateDB(updates) {
  database.ref().update(updates, function (error) {
    if (error) {
      console.error(
        "New client was not added or was not saved! Error occured!"
      );
    } else {
      console.log("Data added/saved to database!");
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
    .catch(function (error) {
      // An error happened.
      console.error(error);
    });
}
