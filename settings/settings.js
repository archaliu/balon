const username = document.querySelector(".ra1");
const password = document.querySelector("#yangi-parol");
const btn = document.querySelector("#save");
const id = sessionStorage.getItem("id");

const API = `http://localhost:7070/api/v1/auth/${id}`;

btn.addEventListener("click", (e) => {
  e.preventDefault();
  if (username.value !== "" && password.value !== "") {
    fetch(API, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    }).then((data) => {
      if (data.status >= 200 && data.status < 300) {
        Toastify({
          duration: 3000,
          text: "Username va Password muvaffaqiyatli o'zgartirildi!",
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },

          onClick: function () {}, // Callback after click
        }).showToast();
      }
    });
  }
  username.value = "";
  password.value = "";
});
