const API_URL = "http://localhost:3001";

// 📥 OBTENER PEDIDOS
export const getPedidos = async () => {
  const res = await fetch(`${API_URL}/pedidos`);
  const data = await res.json();
  return data;
};

// 🔄 ACTUALIZAR STATUS — usa id (timestamp), no numero
export const atualizarStatus = async (id, status) => {
  const res = await fetch(`${API_URL}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  return res.json();
};

// 🗑 ELIMINAR (SOFT DELETE) — usa id (timestamp), no numero
export const eliminarPedido = async (id) => {
  const res = await fetch(`${API_URL}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, eliminar: true }),
  });
  return res.json();
};