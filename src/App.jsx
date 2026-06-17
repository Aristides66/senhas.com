import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [service, setService] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // buscar senhas
  async function fetchPasswords() {
    const { data, error } = await supabase
      .from("passwords")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setItems(data);
  }

  useEffect(() => {
    fetchPasswords();
  }, []);

  // adicionar senha
  async function addPassword() {
    if (!service || !username || !password) return;

    setLoading(true);

    const { error } = await supabase.from("passwords").insert([
      {
        service,
        username,
        password,
      },
    ]);

    setLoading(false);

    if (!error) {
      setService("");
      setUsername("");
      setPassword("");
      fetchPasswords();
    } else {
      alert("Erro ao salvar senha");
    }
  }

  // deletar senha
  async function deletePassword(id) {
    await supabase.from("passwords").delete().eq("id", id);
    fetchPasswords();
  }

  return (
    <div style={styles.container}>
      <h1>🔐 Guardador de Senhas</h1>

      <div style={styles.form}>
        <input
          placeholder="Serviço (ex: Gmail)"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />
        <input
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={addPassword} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>

      <hr />

      <h2>Senhas salvas</h2>

      {items.length === 0 && <p>Nenhuma senha salva.</p>}

      {items.map((item) => (
        <div key={item.id} style={styles.card}>
          <div>
            <strong>{item.service}</strong>
            <p>👤 {item.username}</p>
            <p>🔑 {item.password}</p>
          </div>

          <button
            onClick={() => deletePassword(item.id)}
            style={styles.delete}
          >
            Remover
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "40px auto",
    fontFamily: "Arial",
    padding: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  card: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    border: "1px solid #ddd",
    marginTop: 10,
    borderRadius: 8,
  },
  delete: {
    background: "red",
    color: "white",
    border: "none",
    padding: 10,
    cursor: "pointer",
  },
};