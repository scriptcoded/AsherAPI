//var Asher = require('../core/asher.js')

Asher.addResponder(/^Hi|hello|hey/i, function(){
  Asher.respond('Hello')
})

Asher.addResponder(/^Thanks?\s?(you)?/i, function(){
  Asher.respond('You are welcome')
})

Asher.addResponder(/My name is (\w+)/i, function(){
  var name = RegExp.$1;
  storeName(name);
  Asher.respond("Hello "+name+", It's nice to meet you.")
})

Asher.addResponder(/Call me (\w+)/i, function(){
  var name = RegExp.$1;
  storeName(name);
  Asher.respond("Ok I will call you "+name+" from now on")
})

Asher.addResponder(/What's my name/i, function(){
  var name = Asher.db.get('users_name');
  if ( name ){
    Asher.respond('Your name is '+name)
  }else{
    Asher.respond("You haven't told me your name")
  }
})

Asher.addResponder(/how are you/i, function(){
  Asher.respond('I\'m good, thanks for asking!')
})

function storeName(name){
  Asher.db.set('users_name', name);
}
