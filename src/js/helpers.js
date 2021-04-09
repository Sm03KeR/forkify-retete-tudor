import {TIMEOUT_SEC} from './config.js';

const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };


export const getJSON = async function(url) {  //ia datele de la un api si le trnasforma in json
    try{
    const api = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await api.json();

    if(!api.ok) throw new Error(`${data.message} (${api.status})`);   
    return data;
    }catch(err){
        throw err;
    }

};


export const sendJSON = async function(url, uploadData) {  //trimite datele in json la api
  try{
  const fetchPro = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(uploadData),
  });
  const api = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
  const data = await api.json();

  if(!api.ok) throw new Error(`${data.message} (${api.status})`);   
  return data;
  }catch(err){
      throw err;
  }

};