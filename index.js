"use strict";var effector=require("effector");const AsyncStorage=window.localStorage;function createLocalStore(t,e,o){const r=effector.createEvent(),n=effector.createEffect({handler(){var t=o?o(AsyncStorage.getItem(e)):AsyncStorage.getItem(e);return t||{}}});var a=effector.createEffect({handler(t){try{AsyncStorage.setItem(e,o?JSON.stringify(t):t,t=>{t&&console.error(t)})}catch(t){console.error(t)}}});return n.doneData.watch(t=>{r(t)}),effector.forward({from:t,to:a}),t.on(r,(t,e)=>e),n(),t}const userStore=createLocalStore(effector.createStore({}),"user-data",JSON.parse),setData=effector.createEvent(),updateInfo=effector.createEvent(),removeError=effector.createEvent();async function login(t,e,{succ:o,error:r}){post("login",{data:{email:t,password:e},auth:!1,success:t=>{console.log("data",t),setData({token:t.data.token,info:t.data.info}),o&&o(t.data.info)},error:t=>{console.log(t),setData({error:t}),r&&r(t)}})}function state(){return userStore.getState()}function authToken(){return state().token}function loggedIn(){return!!authToken()}function logout(){setData({})}userStore.on(setData,(t,e)=>e),userStore.on(updateInfo,(t,e)=>({token:t.token,info:{...t.info,...e}})),userStore.on(removeError,(t,e)=>({...t,error:null}));var user={authToken:authToken,loggedIn:loggedIn,login:login,logout:logout,userStore:userStore,removeError:removeError};const path=t=>t.includes("http")?t:"https://lmv-pos-api.herokuapp.com/api/"+t,handleError=async function(t,e){console.log(e),console.log("HANDLE ERROR"),t({status:"error",data:"Somehitng happend."})},handleResp=async function(t,e,o){console.log("HANDLE RESP",t.status,e,o),t.status<400?e(await t.json()):401===t.status?(o({code:401}),logout()):o(await t.json())},fetchWithAuth=function(t,{success:e,error:o,data:r,auth:n=!0,...a}){console.log("IN FETCHWITHAUTH"),a.headers={Authorization:authToken()},r&&(a.body=JSON.stringify({data:r}),a.headers["Content-Type"]="application/json"),!loggedIn()&&n||fetch(path(t),a).then(t=>handleResp(t,e,o),t=>handleError(o,t))};function post(t,e={}){e.method="post",fetchWithAuth(t,e)}function get(t,e={}){e.method="get",fetchWithAuth(t,e)}function put(t,e={}){e.method="put",fetchWithAuth(t,e)}function del(t,e={}){e.method="delete",fetchWithAuth(t,e)}const uploadWithAuth=function(t,{success:e,error:o,data:r,auth:n=!0,...a}){a.headers={Authorization:authToken()},a.method="post",a.body=r,!loggedIn()&&n||fetch(path(t),a).then(t=>handleResp(t,e,o),t=>handleError(o,t))};var api={get:get,post:post,put:put,del:del,uploadWithAuth:uploadWithAuth},index={api:api,user:user};module.exports=index;