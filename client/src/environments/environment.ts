// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  telemetry:{
    serverUrl:'//localhost:1338/api/telemetry',
    socket:{host:'//localhost:1338',message:'telemetry',onadd:'onadd',onconnect:'onconnect',oncreate:'oncreate'}   
  } 
};
