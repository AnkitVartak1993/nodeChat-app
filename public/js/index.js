var socket = io();

socket.on("connect", function () {
     console.log("connected to server");

});

socket.on("disconnect", function () {
    console.log("Disconnected from server");
});

var msgTextBox = jQuery('[name=message]');
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
      text: msgTextBox.val()
  }, function(){
        msgTextBox.val('');
  });
});

var locationButton = jQuery('#send_location');
locationButton.on('click', function(){
    if(!navigator.geolocation){
        return alert('Geolocation not supported by this browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function(position){
        locationButton.removeAttr('disabled').text('Send My Location');
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function(){
        locationButton.removeAttr('disabled').text('Send My Location');
        alert('Unable to fetch location.')
    });
});

socket.on('newLocationMessage',(msg)=>{
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${msg.from}: `);
    a.attr('href', msg.url);
    li.append(a);
    jQuery("#messages").append(li);
});