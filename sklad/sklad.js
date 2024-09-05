const elForm = document.querySelector("#form");
const elParent = document.querySelector("#table-body");
const elSaveBtn = document.querySelector("#add-product");
const elAddBnt = document.querySelector(".add-btn");
const elTemplete = document.querySelector("template");
const elEditProduct = document.querySelector("#edit-product");
const balonNomi = document.querySelector("#nomi");
const balonSoni = document.querySelector("#soni");

const form = document.getElementById("form");
const searchBalonNomi = document.getElementById("form").search1;
const searchRazmeri = document.getElementById("form").search2;
const elEditForm = document.getElementById("edit-form");
const elEditBalon = document.getElementById("edit-form").nomi;
const elEditRazmeri = document.getElementById("edit-form").razmeri;
const elEditSoni = document.getElementById("edit-form").soni;

const API = "http://localhost:7070/api/sklad";

elSaveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      balon: balonNomi.value,

      soni: +balonSoni.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      showMessage("Mahsulot skladga qo'shildi !!!");

      getData();
    });
  balonNomi.value = "";

  balonSoni.value = "";
});

function renderProduct(array, parent = elParent) {
  elParent.textContent = null;
  array.reverse();
  const fragmant = new DocumentFragment();

  array.forEach((product) => {
    const tr = elTemplete.content.cloneNode(true);

    const tds = tr.querySelectorAll("td");

    const balonNomi = tds[0];

    const balonSoni = tds[1];
    const Vaqti = tds[2];
    const Edit = tds[3];
    const btnEdit = tds[4].childNodes[1];
    const btnDelete = tds[4].childNodes[2];

    btnEdit.dataset.id = product.id;
    btnDelete.dataset.id = product.id;

    balonNomi.textContent = product.balon;

    balonSoni.textContent = product.skladCount;

    const isoString = product.createdAt;
    const date = new Date(isoString);
    const readableFormat = date.toLocaleString();
    const editString = product.updatedAt;
    const editDate = new Date(editString);
    const readEditTime = editDate.toLocaleString();

    Vaqti.textContent = readableFormat;
    Edit.textContent = readEditTime;
    fragmant.appendChild(tr);
  });

  parent.appendChild(fragmant);
}
function getData() {
  fetch(API)
    .then((res) => res.json())
    .then((data) => {
      renderProduct(data.data);
    });
}
getData();

searchBalonNomi.addEventListener("input", (e) => {
  e.preventDefault();
  fetch(`${API}/filter?balon=${searchBalonNomi.value}`)
    .then((res) => res.json())
    .then((data) => renderProduct(data));
  if (searchBalonNomi.value == "") {
    getData();
  }
});

elParent.addEventListener("click", (e) => {
  if (e.target.parentElement.classList.contains("edit-btn")) {
    const id = e.target.parentElement.dataset.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        elEditBalon.value = data.data.balon;
        elEditSoni.value = data.data.skladCount;

        elEditProduct.addEventListener("click", (e) => {
          e.preventDefault();
          const soni = +elEditSoni.value;
          fetch(`${API}/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              balon: elEditBalon.value,

              soni: soni,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              showMessage("Mahsulot tahrirlandi", 3000, "gold");

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
        showMessage("Mahsulot skladdan olib tashlandi !!!", 1000, "darkred");
        getData();
      });
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
