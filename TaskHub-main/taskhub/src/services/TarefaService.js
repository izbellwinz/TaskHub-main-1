import http from '../common/http-common';
const API_URL = "/api/v1/tarefas";

const findAll = () => {
    return http.mainInstance.get(API_URL);
};

const findById = (id) => {
    return http.mainInstance.get(API_URL + `/${id}`);
};

const findByAgendaId = (agendaId) => {
    return http.mainInstance.get(API_URL + `/agenda/${agendaId}`);
};

const create = (data) => {
    return http.mainInstance.post(API_URL, data);
};

const update = (id, data) => {
    return http.mainInstance.put(API_URL + `/${id}`, data);
};

const remove = (id) => {
    return http.mainInstance.delete(API_URL + `/${id}`);
};

const TarefaService = {
    findAll,
    findById,
    findByAgendaId,
    create,
    update,
    remove,
};

export default TarefaService;
