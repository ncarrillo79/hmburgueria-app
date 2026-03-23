const BASE_URL = "http://localhost:3001";

// 🔹 GET pedidos
export async function getPedidos() {
  const res = await fetch(`${BASE_URL}/pedidos`);
  return await res.json();
}

// 🔹 ACTUALIZAR STATUS
export async function atualizarStatus(numero, status) {
  console.log("Enviando status:", numero, status);

  const res = await fetch(`${BASE_URL}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      numero,
      status
    })
  });

  const data = await res.json();
  console.log("Respuesta:", data);

  return data;
}

// 🔹 ELIMINAR
export async function eliminarPedido(numero) {
  const res = await fetch(`${BASE_URL}/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      numero
    })
  });

  return await res.json();
}