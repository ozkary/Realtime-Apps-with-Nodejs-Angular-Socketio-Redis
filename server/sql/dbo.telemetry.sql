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

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Telemetry](
	[telemetryId] [int] IDENTITY(1,1) NOT NULL,
	[deviceId] [nvarchar](200) NULL,
	[temperature] [numeric](6, 3) NULL,
	[humidity] [numeric](6, 3) NULL,
	[sound] [numeric](6, 3) NULL,
	[processed] [datetime] NOT NULL,
	[created] [datetime] NOT NULL,
 CONSTRAINT [PK_Telemetry] PRIMARY KEY CLUSTERED 
(
	[telemetryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Telemetry] ADD  DEFAULT (getdate()) FOR [created]
GO


