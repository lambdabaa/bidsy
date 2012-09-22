
var io = {};


/**
 * @param {string} host The socket.io host.
 * @param {Object} details Configuration for the socket client.
 */
io.connect = function(host, details) {};



/**
 * @constructor
 */
io.SocketNamespace = function() {};


/**
 * @param {string} name Message to send to server.
 * @param {...} varargs Optional extra arguments to emit.
 */
io.SocketNamespace.prototype.emit = function(name, varargs) {};


/**
 * @param {string} name The name of an event to listen for.
 * @param {Function} callback The code to execute when the event gets fired.
 */
io.SocketNamespace.prototype.on = function(name, callback) {};
