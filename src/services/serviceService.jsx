import request from 'Util/request';

const baseUrl = '/conductor/api/v1';
const baseRawUrl = '/conductor/api/v1/_raw';

export default {
  getServices: (namespace) => {
    return request(baseUrl + "/service/" + namespace, {method: 'GET'});
  },

  getServiceDetail: (namespace, name) => {
    return request(baseRawUrl + "/service/namespace/" + namespace + "/name/" + name, {method: 'GET'})
  },

  updateService: (service) => {
    return request(baseRawUrl + "/service/namespace/" + service.metadata.namespace + "/name/" + service.metadata.name, {
      method: "PUT",
      body: service
    })
  },

  deleteService: (namespace, name) => {
    return request(baseRawUrl + "/service/namespace/" + namespace + "/name/" + name, {method: "DELETE"})
  }
}