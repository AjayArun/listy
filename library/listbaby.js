var oauth = OAuth({
    consumer: {
        public: 'HFPTqx1Ef7lZDT9lISUHmdHuP',
        secret: 'tDYak1hVc4a79gG8dXBeXz3OMiDWAahKrX44Ym7Ea7tfqR1xPI'
    },
    signature_method: 'HMAC-SHA1',
    //last_ampersand: "",
    version: "1.0"
});

//url for list https://api.twitter.com/1.1/lists/list.json, GET
//url for list members https://api.twitter.com/1.1/lists/members.json, GET, {"list_id" : "203783396"}

var request_data = {
    url: 'https://api.twitter.com/1.1/lists/members/create.json',
    method: 'POST',
    data: {"list_id" : "203783396", "screen_name" : "facebook"}
};

var token = {
        public: '',
        secret: ''
};

$("#button").click(function(){
      auth =  oauth.authorize(request_data, token);
      $.ajax({
         url: request_data.url,
         type: request_data.method,
         data: request_data.data,
         headers: oauth.toHeader(auth)
      }).done(function(data){
      console.log(" data : " + JSON.stringify(data));
      });
});
