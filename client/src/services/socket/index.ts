import io from "socket.io-client";

/*
const socketConnection = io("http://localhost:8000/", {
  path: "/chat/socket.io/",
});
export default socketConnection;
*/

var Socket = (function () {
  var instance: any = null;

  function createInstance() {
    const socketConnection = io("http://localhost:8000/", {
      path: "/chat/socket.io/",
    });
    return socketConnection;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

export default Socket;

/*
function run() {

  var instance1 = Singleton.getInstance();
  var instance2 = Singleton.getInstance();

  console.log("Same instance? " + (instance1 === instance2));
}
*/
