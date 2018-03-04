var moment = require('moment');

var generateLocationMessage = (from, latitude, longitude)=>{
    return {
        from,
        url:`https://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    }

};

var generateMessage = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateLocationMessage, generateMessage}