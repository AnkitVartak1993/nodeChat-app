var socket = io();

socket.on("connect", function () {
     console.log("connected to server");

});

socket.on("disconnect", function () {
    console.log("Disconnected from server");
});

socket.on('newMessage',function (msg){
    console.log('new msg from server',msg);
    var li = jQuery('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);
    jQuery("#messages").append(li);
});

jQuery('#message_form').on('submit', function(e){
    e.preventDefault();
  
  socket.emit('createMessage',{
      from:'user',
      text: jQuery('[name=message]').val()
  }, function(){

  });
});
