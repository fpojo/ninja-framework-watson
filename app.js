var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');

var config 		 = require('./app/config/config');
var lines 		 = require('./app/config/lines');
var visualrecog  = require('./app/watson/visualrecognition');
var conversation = require('./app/watson/conversation');
var tts 		 = require('./app/watson/texttospeech');
var stt 		 = require('./app/watson/speechtotext');
var facebot 	 = require('./app/helpers/facebot');
var modBoleto 	 = require('./app/boleto');

var app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Inicializa o Bot do Facebook
var bot = new facebot({
    page_token: config.facebook.page_token,
    verify_token: config.facebook.verify_token
});
app.use('/webhook', bot.middleware());

bot.on('message', function(userId, message){
	console.log("ENTROU_00");
	bot.getUserProfile(userId, function (err, profile) {
		console.log("USER > " + JSON.stringify(profile));
	});
	conversation.call(message,function(err,resposta){
		orquestrador(resposta, userId);
	});
});

bot.on('attachment', function(userId, attachment){
	console.log("ENTROU_01");
    if (attachment[0].type == "audio") {
		console.log("AUDIO URL > " + attachment[0].payload.url);
		stt.text(attachment[0].payload.url,function(err,resposta){
			if(err){
				var url = config.system.url + lines.urlErroAudio;
        		bot.sendAudioAttachment(userId, url);
			}else{
				console.log("STT > " + JSON.stringify(resposta.toString()));
				conversation.call(resposta.toString(),function(err,res){
					console.log(JSON.stringify(res));
					var url = config.system.url + "/tts/synthesize?text=" + encodeURI(res.output.text[0]);
					bot.sendAudioAttachment(userId, url);
					
					//orquestrador(res, userId);
				});
				//bot.sendTextMessage(userId, "Entendi que você disse: " + resposta);
			}
		});	
    } else if (attachment[0].type == "image") {
		visualrecog.classificar(attachment[0].payload.url,function(err,res){
			if(err || !res.images[0] || res.images[0].classifiers == undefined || res.images[0].classifiers == "undefined" || res.images[0].classifiers[0].classes == "undefined") 
				bot.sendTextMessage(userId, "Não foi possível classificar essa imagem.");
			else{
				var c_class = res.images[0].classifiers[0].classes[0].class;

				if(c_class == "stadium" || c_class == "sports"){
					bot.sendTextMessage(userId, "sua mensagem");
					bot.sendTextMessage(userId, "Você tem mais alguma dúvida?");
				}else if(c_class == "beer"){
					bot.sendTextMessage(userId, "sua mensagem");
					bot.sendTextMessage(userId, "Posso te ajudar com mais alguma coisa?");
				}else if(c_class == "animal"){
					bot.sendTextMessage(userId, "sua mensagem");
					bot.sendTextMessage(userId, "Posso te ajudar com mais alguma coisa?");
				}
			}
				
		});
	}
});

app.get('/tts/synthesize', function (req, res, next) {
	tts.sintetizar(req.query.text).pipe(res);
});

app.get('/boleto', function (req, res) {
	var params = { cpf: req.query.cpf }
	modBoleto.createBoleto(params, function (err, results) {
		if (err) res.send('Erro ao gerar o boleto.');
		res.send(results);
	});
});
 
function orquestrador(respostaJSON, userId) {

	if(respostaJSON != null && respostaJSON.isRR){
		bot.sendTextMessage(userId, respostaJSON.rr.response.docs[0].body);
	}else if(respostaJSON != null && respostaJSON.output != null){
		for(var i=0; i < respostaJSON.output.text.length; i++){
			var resposta = respostaJSON.output.text[i].toString();
		
			if(resposta == config.convflags.boleto){
				linkurl = config.system.url + "/boleto?cpf=" + respostaJSON.context.user_cpf;
				messageData = modBoleto.generateFBResponse(linkurl,"Para visualizar seu novo boleto clique no botão");
				bot.sendGenericMessage(userId, messageData);
			}else{
				bot.sendTextMessage(userId, resposta);
				if(config.texttospeech.active){
					var url = config.system.url + "/tts/synthesize?text=" + encodeURI(resposta);
					bot.sendAudioAttachment(userId, url);
				}
			}
		}
	}
}

app.listen(config.system.port, config.system.host);