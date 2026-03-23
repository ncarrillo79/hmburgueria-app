const API_URL = "http://localhost:3001";

// 📥 OBTENER PEDIDOS
export const getPedidos = async () => {
  const res = await fetch(`${API_URL}/pedidos`);
  const data = await res.json();

  return data;
};

// 🔄 ACTUALIZAR STATUS
export const atualizarStatus = async (numero, status) => {
  await fetch(`${API_URL}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      numero,
      status
    })
  });
};

// 🗑 ELIMINAR (SOFT DELETE)
export const eliminarPedido = async (numero) => {
  await fetch(`${API_URL}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      numero,
      eliminar: true
    })
  });
};