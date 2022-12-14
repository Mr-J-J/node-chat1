var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usocket = [];
const em = require('emyuyan');
var con = '';

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){

  console.log('-----------------------')
  socket.on("join", function (name) {
    usocket[name] = socket
    io.emit("join", name)
    console.log(name+'加入了群聊')
  })

  socket.on("message", function (msg) {
    con = msg
    io.emit("message", em.chouxiang(msg)) //将新消息广播出去
  })

//  接受解释指令
  socket.on("jieshi", function () {
    socket.emit("logreturn", con)
  })
//  接受翻译指令
  socket.on("fanyi", function (msg) {
    socket.emit("logreturn", em.dechouxiang(msg))
  })

});
//获取本地ip
const os = require('os');
function getIPAdress() {
  var interfaces = os.networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}
http.listen(3000, function() {
  console.log(getIPAdress()+':3000');
});
