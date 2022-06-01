var $gXNCa$effector = require("effector");

function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "default", () => $4fa36e821943b400$export$2e2bcd8739ae039);


const $dff49b3875c18f9a$var$AsyncStorage = window.localStorage;
function $dff49b3875c18f9a$export$2e2bcd8739ae039(store, key, parser) {
    const init = (0, $gXNCa$effector.createEvent)();
    const fetchCountFromAsyncStorageFx = (0, $gXNCa$effector.createEffect)({
        handler () {
            const value = parser ? parser($dff49b3875c18f9a$var$AsyncStorage.getItem(key)) : $dff49b3875c18f9a$var$AsyncStorage.getItem(key);
            return value ? value : {};
        }
    });
    const updateCountInAsyncStorageFx = (0, $gXNCa$effector.createEffect)({
        handler (data) {
            try {
                $dff49b3875c18f9a$var$AsyncStorage.setItem(key, parser ? JSON.stringify(data) : data, (err)=>{
                    if (err) console.error(err);
                });
            } catch (err) {
                console.error(err);
            }
        }
    });
    fetchCountFromAsyncStorageFx.doneData.watch((result)=>{
        init(result);
    });
    (0, $gXNCa$effector.forward)({
        from: store,
        to: updateCountInAsyncStorageFx
    });
    store.on(init, (_, value)=>value);
    fetchCountFromAsyncStorageFx();
    return store;
}



const $84c2ee26ce0b5994$var$userStore = (0, $dff49b3875c18f9a$export$2e2bcd8739ae039)((0, $gXNCa$effector.createStore)({}), "user-data", JSON.parse);
const $84c2ee26ce0b5994$var$setData = (0, $gXNCa$effector.createEvent)();
const $84c2ee26ce0b5994$var$updateInfo = (0, $gXNCa$effector.createEvent)();
const $84c2ee26ce0b5994$var$removeError = (0, $gXNCa$effector.createEvent)();
$84c2ee26ce0b5994$var$userStore.on($84c2ee26ce0b5994$var$setData, (state, val)=>val);
$84c2ee26ce0b5994$var$userStore.on($84c2ee26ce0b5994$var$updateInfo, (state1, v)=>({
        token: state1.token,
        info: {
            ...state1.info,
            ...v
        }
    }));
$84c2ee26ce0b5994$var$userStore.on($84c2ee26ce0b5994$var$removeError, (state2, _)=>({
        ...state2,
        error: null
    }));
async function $84c2ee26ce0b5994$var$login(email, password, { succ: succ , error: error  }) {
    (0, $483d053f6957138a$exports.post)("login", {
        data: {
            email: email,
            password: password
        },
        auth: false,
        success: (json)=>{
            console.log("data", json);
            $84c2ee26ce0b5994$var$setData({
                token: json.data.token,
                info: json.data.info
            });
            if (succ) succ(json.data.info);
        },
        error: (e)=>{
            console.log(e);
            $84c2ee26ce0b5994$var$setData({
                error: e
            });
            if (error) error(e);
        }
    });
}
function $84c2ee26ce0b5994$var$state() {
    return $84c2ee26ce0b5994$var$userStore.getState();
}
function $84c2ee26ce0b5994$var$authToken() {
    return $84c2ee26ce0b5994$var$state().token;
}
function $84c2ee26ce0b5994$var$loggedIn() {
    return !!$84c2ee26ce0b5994$var$authToken();
}
function $84c2ee26ce0b5994$var$logout() {
    $84c2ee26ce0b5994$var$setData({});
}
var $84c2ee26ce0b5994$export$2e2bcd8739ae039 = {
    authToken: $84c2ee26ce0b5994$var$authToken,
    loggedIn: $84c2ee26ce0b5994$var$loggedIn,
    login: $84c2ee26ce0b5994$var$login,
    logout: $84c2ee26ce0b5994$var$logout,
    userStore: $84c2ee26ce0b5994$var$userStore,
    removeError: $84c2ee26ce0b5994$var$removeError
};


const $483d053f6957138a$var$path = (url)=>url.includes("http") ? url : `/api/${url}`;
// const path = (url) => ( url.includes('http') ? url : `http://localhost:9292/api/${url}` )
const $483d053f6957138a$var$handleError = async function(error, r) {
    console.log(r);
    console.log("HANDLE ERROR");
    error({
        status: "error",
        data: "Somehitng happend."
    });
};
const $483d053f6957138a$var$handleResp = async function(r, succ, error) {
    console.log("HANDLE RESP", r.status, succ, error);
    if (r.status < 400) succ(await r.json());
    else if (r.status === 401) {
        error({
            code: 401
        });
        (0, $84c2ee26ce0b5994$exports.logout)();
    } else error(await r.json());
};
const $483d053f6957138a$var$fetchWithAuth = function(url, { success: success , error: error , data: data , auth: auth = true , ...options }) {
    console.log("IN FETCHWITHAUTH");
    options.headers = {
        Authorization: (0, $84c2ee26ce0b5994$exports.authToken)()
    };
    if (data) {
        options.body = JSON.stringify({
            data: data
        });
        options.headers["Content-Type"] = "application/json";
    }
    if ((0, $84c2ee26ce0b5994$exports.loggedIn)() || !auth) fetch($483d053f6957138a$var$path(url), options).then((r)=>$483d053f6957138a$var$handleResp(r, success, error), (e)=>$483d053f6957138a$var$handleError(error, e));
};
function $483d053f6957138a$var$post(url, options = {}) {
    options.method = "post";
    $483d053f6957138a$var$fetchWithAuth(url, options);
}
function $483d053f6957138a$var$get(url, options = {}) {
    options.method = "get";
    $483d053f6957138a$var$fetchWithAuth(url, options);
}
function $483d053f6957138a$var$put(url, options = {}) {
    options.method = "put";
    $483d053f6957138a$var$fetchWithAuth(url, options);
}
function $483d053f6957138a$var$del(url, options = {}) {
    options.method = "delete";
    $483d053f6957138a$var$fetchWithAuth(url, options);
}
var $483d053f6957138a$export$2e2bcd8739ae039 = {
    get: $483d053f6957138a$var$get,
    post: $483d053f6957138a$var$post,
    put: $483d053f6957138a$var$put,
    del: $483d053f6957138a$var$del
};



var $4fa36e821943b400$export$2e2bcd8739ae039 = {
    api: $483d053f6957138a$export$2e2bcd8739ae039,
    user: $84c2ee26ce0b5994$export$2e2bcd8739ae039
};


//# sourceMappingURL=index.js.map
