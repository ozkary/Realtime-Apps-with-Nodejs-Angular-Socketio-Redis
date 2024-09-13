export const environment = {
  production: true,
  telemetry:{
    serverUrl:'//localhost:1338/api/telemetry',
    socket:{host:'//localhost:1338',message:'telemetry',onadd:'onadd',onconnect:'onconnect',oncreate:'oncreate'}   
  } ,
  chartFeature:{
    serverUrl:'',
    incomingMsg:'',
    outgoingMsg:''
  }
};
