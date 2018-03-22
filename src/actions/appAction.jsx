import request from 'Util/request';

export const getAppList = () => {
  return {
    type: 'REQUESTAPPS',
    payload: request("/conductor/api/v1/workload", {
      method: 'GET'
    })
  } 
}