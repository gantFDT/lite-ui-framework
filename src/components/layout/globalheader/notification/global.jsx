const global = {
    connectionId: null,  //发送给服务端的id标识信息
}
export default {
    getConnectionId() {
        return global.connectionId;
    },

    setConnectionId(id) {
        global.connectionId = id;
    },

};