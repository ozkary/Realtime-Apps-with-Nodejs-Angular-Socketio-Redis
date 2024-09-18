/*!
    *
    * https://www.ozkary.com/ by Oscar Garcia
    * Licensed under the MIT license. Please see LICENSE for more information.
    *   
    * selects data from the telemetry table from the last two hours
    * Repo: 
    * https://github.com/ozkary/Realtime-Apps-with-Nodejs-Angular-Socketio-Redis
    *
    * Created By oscar garcia 
    *
    * Update/Fix History
    *   ogarcia 01/20/2018 initial implementation
    *
*/
SELECT [telemetryId]
      ,[deviceId]
      ,[temperature]
      ,[humidity]
      ,[sound]
      ,[processed]
      ,[created]
  FROM [dbo].[Telemetry] (nolock)
  WHERE 
  processed > dateadd(HOUR,-2, getdate())
  order by telemetryId desc