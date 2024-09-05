const elForm = document.querySelector("#form");
const elParent = document.querySelector("#table-body");
const elSaveBtn = document.querySelector("#add-product");
const elAddBnt = document.querySelector(".add-btn");
const elTemplete = document.querySelector("template");
const elEditProduct = document.querySelector("#edit-product");

const elCustomer = document.querySelector("#oluvchi");
const elProduct = document.querySelector("#nomi");

const elPrice = document.querySelector("#narxi");
const elSum = document.querySelector("#soni");
const elEditForm = document.querySelector("#edit-form");
const searchOluvchi = document.getElementById("form").search0;
const searchBalonNomi = document.getElementById("form").search1;
const searchRazmeri = document.getElementById("form").search2;
const API = "http://localhost:7070/api/bozor";

function getData() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      renderProduct(data.data);
    });
}
getData();

elSaveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      oluvchi: elCustomer.value,
      balon: elProduct.value,

      soni: +elSum.value,
      narxi: elPrice.value,
      isVetrina: true,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.statusCode) {
        showMessage("Mahsulot bozorga qo'shildi !!!");
      } else {
        showMessage(data.message, 3500, "red");
      }

      getData();
    });
  elCustomer.value = "";
  elProduct.value = "";

  elSum.value = "";
  elPrice.value = "";
});

function renderProduct(array, parent = elParent) {
  elParent.textContent = null;
  array.reverse();
  const fragmant = new DocumentFragment();

  array.forEach((product) => {
    const tr = elTemplete.content.cloneNode(true);
    const tds = tr.querySelectorAll("td");
    const oluvchi = tds[0];
    const balonNomi = tds[1];

    const soni = tds[2];
    const narxi = tds[3];
    const vaqti = tds[4];
    const edited = tds[5];
    const btnEdit = tds[6].childNodes[1];
    const btnDelete = tds[6].childNodes[2];
    btnDelete.dataset.id = product.id;
    btnEdit.dataset.id = product.id;
    oluvchi.textContent = product.oluvchi;
    balonNomi.textContent = product.balon;

    soni.textContent = product.soni;
    narxi.textContent = product.narxi;
    const isoString = product.createdAt;
    const date = new Date(isoString);
    const readableFormat = date.toLocaleString();
    const editString = product.updatedAt;
    const editDate = new Date(editString);
    const readEditTime = editDate.toLocaleString();
    vaqti.textContent = readableFormat;
    edited.textContent = readEditTime;
    fragmant.appendChild(tr);
  });

  parent.appendChild(fragmant);
}

elParent.addEventListener("click", (e) => {
  if (e.target.parentElement.classList.contains("edit-btn")) {
    const id = e.target.parentElement.dataset.id;
    console.log(id);

    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        elEditForm.oluvchi.value = data.oluvchi;
        elEditForm.nomi.value = data.balon;

        elEditForm.soni.value = data.soni;
        elEditForm.narxi.value = data.narxi;

        elEditProduct.addEventListener("click", (e) => {
          e.preventDefault();

          const soni = +elEditForm.soni.value;

          fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              oluvchi: elEditForm.oluvchi.value,
              balon: elEditForm.nomi.value,

              soni: soni,
              narxi: elEditForm.narxi.value,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (!data.statusCode) {
                showMessage("Mahsulot Tahrirlandi !!!", 3000, "gold");
              } else {
                showMessage(data.message, 4000);
              }

              getData();
            });
        });
      });
  }
  if (e.target.parentElement.classList.contains("delete-btn")) {
    const id = e.target.parentElement.dataset.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        showMessage("Mahsulot bozordan olib tashlandi !!", 1000, "darkred");

        getData();
      });
  }
});

searchBalonNomi.addEventListener("input", (e) => {
  e.preventDefault();
  fetch(`${API}/filterDate?balon=${searchBalonNomi.value}`)
    .then((res) => res.json())
    .then((data) => renderProduct(data));
  if (searchBalonNomi.value == "") {
    getData();
  }
});

searchOluvchi.addEventListener("input", (e) => {
  fetch(
    `${API}/filterDate?balon=${searchBalonNomi.value}&oluvchi=${searchOluvchi.value}`
  )
    .then((res) => res.json())
    .then((data) => renderProduct(data));
  if (searchBalonNomi.value == "" && searchOluvchi.value == "") {
    getData();
  }
});

function showMessage(
  message,
  time = 3000,
  color = "linear-gradient(to right, #00b09b, #96c93d)"
) {
  Toastify({
    text: message,
    duration: time,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: color,
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}
