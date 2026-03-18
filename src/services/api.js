const API_URL = "https://script.google.com/macros/s/AKfycbxvCi8IiGEInNMnD4NU3_aEIKj7NSjKPQpwimDt0Z-p1InnNhbMYozSHTpKoYUMyJUk8A/exec"; // cole aqui a URL do Apps Script

export async function getPedidos() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function atualizarStatus(numero, status) {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ numero, status }),
  });
}

export async function eliminarPedido(numero) {
  await fetch(API_URL, {
    method: "DELETE",
    body: JSON.stringify({ numero }),
  });
}