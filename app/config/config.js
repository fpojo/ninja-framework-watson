var config = {};

config.conversation = {};
config.retrieveandrank = {};
config.texttospeech = {};
config.speechtotext = {};
config.database = {};
config.facebook = {};
config.system = {};
config.convflags = {};
config.visualrecognition = {};

// Configuracoes IBM Watson Conversation
config.conversation.workspace = process.env.WORKSPACE_ID || 'Userid-workspace';
config.conversation.username = process.env.CONVERSATION_USERNAME || 'username';
config.conversation.password = process.env.CONVERSATION_PASSWORD || 'passw';
config.conversation.versiond = '2016-09-20';

// Configuracoes IBM Watson Retrieve and Rank
config.retrieveandrank.active = false;
config.retrieveandrank.username = process.env.RR_USERNAME || "#RUSER";
config.retrieveandrank.password = process.env.RR_PASSWORD || "#RPASS";
config.retrieveandrank.cluster_id = "#CLUSTER";
config.retrieveandrank.collection_name = "#COLLECTION";

// Configuracoes IBM Watso Text to Speech
config.texttospeech.active = false;
config.texttospeech.username = process.env.TTS_USERNAME || 'username';
config.texttospeech.password = process.env.TTS_PASSWORD || 'passw';
config.texttospeech.model = "pt-BR_IsabelaVoice";

// Configuracoes IBM Watson Speech to Text
config.speechtotext.username = process.env.STT_USERNAME || 'username';
config.speechtotext.password = process.env.STT_PASSWORD || 'passw';

// Configuracoes IBM Watson Visual Recognition
config.visualrecognition.apikey = process.env.VR_API || 'apikey';
config.visualrecognition.customclassifierid = '#CLASSIF';

// Configuracoes de Flags
config.convflags.boleto = "--CREATEBOLETO";
config.convflags.userar = "--GETFROMRR";

// Configuracoes DashDB
config.database.db = "BLUDB";
config.database.hostname = "bluemix05.bluforcloud.com";
config.database.port = 50000;
config.database.username = "username";
config.database.password = "passw";
config.database.histtable = "#DASHTABLE";

config.facebook.page_token = "token";
config.facebook.verify_token = "tokenDeVerificacaoFacebook";

// Configuracoes do sistema
config.system.host = (process.env.VCAP_APP_HOST || 'localhost');
config.system.port = (process.env.VCAP_APP_PORT || 3000);
config.system.url = "http://YOURPROJECTNAME.mybluemix.net";

module.exports = config;