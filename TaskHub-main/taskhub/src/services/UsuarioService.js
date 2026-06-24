import http from '../common/http-common';
const API_URL = "/api/v1/usuarios";

const findAll = () => {
    return http.mainInstance.get(API_URL);
};

const findById = (id) => {
    return http.mainInstance.get(API_URL + `/${id}`);
};

const register = (nome, email, password) => {
    return http.mainInstance.post(API_URL, {
        nome,
        email,
        senha: password,
    });
};

const login = async (email, senha) => {
    const response = await http.mainInstance
        .post(API_URL + "/login", {
            email,
            senha,
        });
    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};


const update = (id, data) => {
    return http.mainInstance.put(API_URL + `/${id}`, data);
};

const inativar = (id) => {
    return http.mainInstance.put(API_URL + `/inativar/${id}`);
};

const reativar = (id) => {
    return http.mainInstance.put(API_URL + `/reativar/${id}`);
};

const alterarSenha = (id, data) => {
    return http.mainInstance.put(API_URL + `/alterarSenha/${id}?senha=${encodeURIComponent(data.senha)}`);
};

const findByNome = nome => {
    return http.mainInstance.get(API_URL + `/findByNome?nome=${nome}`);
};


const resetSenha = (email, novaSenha) => {
    return http.mainInstance.post(API_URL + "/resetSenha", { email, novaSenha });
};

const UsuarioService = {
    findAll,
    findById,
    register,
    login,
    logout,
    getCurrentUser,
    update,
    inativar,
    reativar,
    alterarSenha,
    findByNome,
    resetSenha,
}

export default UsuarioService;