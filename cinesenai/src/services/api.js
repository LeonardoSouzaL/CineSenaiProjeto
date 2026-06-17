const BASE_URL = "";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (url, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...options.headers,
  };
  const response = await fetch(url, { ...options, headers });
  if (response.status === 204) {
    return null;
  }
  if (response.status === 401 || response.status === 403) {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-change"));
    }
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Erro na Requisição (Status: ${response.status})`,
    );
  }
  return response.json();
};
export const api = {
  auth: {
    login: (email, senha) =>
      request("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, senha }),
      }),
    cadastro: (nome, email, senha) =>
      request("/api/auth/cadastro", {
        method: "POST",
        body: JSON.stringify({ nome, email, senha }),
      }),
  },
  filmes: {
    listar: () => request("/api/filmes"),
    buscarPorId: (id) => request(`/api/filmes/${id}`),
    criar: (filme) =>
      request("/api/filmes", {
        method: "POST",
        body: JSON.stringify(filme),
      }),
    atualizar: (filme, id) =>
      request(`/api/filmes/${id}`, {
        method: "PUT",
        body: JSON.stringify(filme),
      }),
    deletar: (id) =>
      request(`/api/fimles/${id}`, {
        method: "DELETE",
      }),
  },
  salas: {
    listar: () => request("/api/salas"),
    buscarPorId: (id) => request(`/api/salas/${id}`),
    criar: (sala) =>
      request(`/api/salas`, {
        method: "POST",
        body: JSON.stringify(sala),
      }),
    atualizar: (sala, id) =>
      request(`/api/salas/${id}`, {
        method: "PUT",
        body: JSON.stringify(sala),
      }),
    deletar: (id) =>
      request(`/api/sala/${id}`, {
        method: "DELETE",
      }),
  },
  sessoes: {
    listarPorData: (data) => request(`/api/sessoes?data=${data}`),
    buscarPorFilme: (filmeId) => request(`/api/sessoes?filmeId=${filmeId}`),
    buscarPorId: (id) => request(`/api/sessoes/${id}`),
    listarAssentos: (id) => request(`api/sessoes/${id}/assentos`),
    criar: (sessao) =>
      request(`/api/sessoes`, {
        method: "POST",
        body: JSON.stringify(sessao),
      }),
    // Criado por mim :D (N obrigatório).
    atualizar: (sessao, id) =>
      request(`/api/sessoes/${id}`, {
        method: "PUT",
        body: JSON.stringify(sessao),
      }),
    deletar: (id) =>
      request(`/api/sessoes/${id}`, {
        method: "DELETE",
      }),
  },
  reservas: {
    criar: (sessaoId, assentoId) =>
      request(`/api/reservas`, {
        method: "POST",
        body: JSON.stringify({ sessaoId, assentoId }),
      }),
    listarMinhas: () => request(`/api/reservas/minhas`),
    // Criado por mim :D (N obrigatório).
    atualizar: (reserva, id) =>
      request(`/api/reservas/${id}`, {
        method: "PUT",
        body: JSON.stringify(reserva),
      }),
    cancelar: (id) =>
      request(`/api/reservas/${id}`, {
        method: "DELETE",
      }),
  },
  avaliacoes: {
    listar: (filmeId) => request(`/api/filmes/${filmeId}/avaliacoes`),
    criar: (filmeId, avalicao) =>
      request(`/api/filme/${filmeId}/avaliacoes`, {
        method: "POST",
        body: JSON.stringify(avalicao),
      }),
  },
  admin: {
    listarReservas: () => request("/api/admin/reservas"),
    gerarRelatorio: () => request("/api/admin/relatorios"),
    promoverUsuario: (id) =>
      request(`/api/admin/usuario/${id}/promover`, {
        method: "PATCH",
      }),
  },
  favoritos: {
    listar: () => request("/api/favoritos"), // TODO
    adicionar: (filmeId) =>
      request(`/api/${filmeId}/favoritos`, {
        method: "POST",
        body: JSON.stringify({ filmeId }),
      }), // TODO
    remover: (filmeId) =>
      request(`/api/favoritos/${filmeId}`, {
        method: "DELETE",
      }), // TODO
    verificar: (filmeId) =>
      request(`/api/favoritos/verificar?filmeId=${filmeId}`),
  },
  usuario: {
    buscarPerfil: () => request("/api/usuario/perfil"),
    atualizarPerfil: (nome, email) =>
      request(`/api/usuario/perfil/${(nome, email)}`, {
        method: "PUT",
        body: JSON.stringify({ nome, email }),
      }),
    trocarSenha: (senhaAtual, novaSenha) =>
      request(`/api/usuario/perfil${(senhaAtual, novaSenha)}`, {
        method: "PATCH",
        body: JSON.stringify({ senhaAtual, novaSenha }),
      }),
    excluirConta: (perfilId) =>
      request(`/api/usuario/perfil/${perfilId}`, {
        method: "DELETE",
      }),
  },
};
