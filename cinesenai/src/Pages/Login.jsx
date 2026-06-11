import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Login.css";

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !senha || (isRegister && !nome)) {
      showToast("Por favor, preencha os campos.", "error");
      return;
    }
    setLoading(true);
    try {
      if (isRegister) {
        await register(nome, email, senha);
        showToast("Cadastro realizado com sucesso! Bem-Vindo", "Success");
      } else {
        await login(email, senha);
        showToast("Login realizado com sucesso! Bem-Vindo", "Success");
      }
      navigate("/");
    } catch (error) {
      showToast(
        error.massage ||
          "Ocorreu um erro ao processar sua solicitação! Bem-Vindo",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="auth-logo">
            Cine <span>SENAI</span>
          </div>
          <p className="login-subtitle">
            {isRegister
              ? "Crie sua conta para reservar ingressos"
              : "Acesse sua conta para ver suas sessões"}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label htmlFor="nome">Nome Completo</label>
              <input
                type="text"
                id="nome"
                className="form-control"
                placeholder="Ex: Leonardo Souza"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
          {isRegister && (
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Ex: leonardoleozinho123@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
          {isRegister && (
            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                className="form-control"
                placeholder="*********"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
              />
            </div>
          )}
          <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading} ></button>
        </form>
      </div>
    </div>
  );
};
