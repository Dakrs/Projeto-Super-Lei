const {google} = require('googleapis');
var Credential = require('./controllers/credentials')
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly','https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/gmail.readonly'];
const readline = require('readline');
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
exports.authorize = (credentials,callback) => {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
      Credential.listar()
      .then(dados =>{
           if (dados.length >0){
                oAuth2Client.setCredentials(dados[0].token)
                return callback(oAuth2Client)
           }
           else {
                getNewToken(oAuth2Client,function(response){
                    return callback(response)
                })
           }     
        
     
  })
}


export async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
/*
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();

    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
        creden.type = "GOOGLE"
        creden.owner = "me"
        creden.token = token
        console.log(token)
        Credential.insert(creden)
        .then( dados1 => {
          oAuth2Client.setCredentials(token)
          return callback(oAuth2Client)})
      })

    });
*/
return authUrl
}

export default { getNewToken}



