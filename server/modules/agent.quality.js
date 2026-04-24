const { VertexAI } = require('@google-cloud/vertexai');
const config = require('./config.js');

class QualityEngineerAgent {
  constructor(projectId) {
    this.slidingWindow = [];
    this.nextWindow = 0;
    this.windowSize = 20;
    this.isThinking = false;
    this.projectId = config.PROJECT_ID;
    this.location = 'us-east1';
    this.model = 'gemini-2.5-flash';

    // Initialize Vertex AI
    const vertexAI = new VertexAI({ project: this.projectId, location: this.location });
    this.model = vertexAI.getGenerativeModel({
      model: this.model,
      // Define the permanent identity of the Agent
      systemInstruction: {  
        role: 'system',
        parts: [{ text: `
          You are the Quality Engineer Agent for a Real-Time Telemetry System.
          Data Schema: id, deviceId, temperature, humidity, sound.
          
          Control Limits ($3\sigma$):
          - Temperature: Mean 35, UCL 42, LCL 28
          - Sound: Mean 122, UCL 126, LCL 118
          - Humidity: Mean 64, UCL 70, LCL 58
          
          Core Directives:
          1. Identify statistical violations and tell the 'story' of the drift.
          2. If safety is breached, explicitly output 'ACTION: SHUTDOWN'.
          3. Maintain history context to identify if a trend is accelerating.` 
        }]
      }
    });
  }

  /**
   * Internal method to manage the sliding window logic
   */
  async watch(socket, data) {
    // Add to window and maintain size
    this.slidingWindow.push(data);
    this.nextWindow += 1;
    if (this.slidingWindow.length > this.windowSize) {
      this.slidingWindow.shift();
    }

    //Logic: Immediate threat detection
    // const isSpark = data.temperature > 42 || data.sound > 126;

    // if (isSpark && !this.isThinking) {
    //   await this.chat(socket, "FAILURE DETECTED: Analyze immediate failure risk.");
    // } 

    console.log('AI Agent is thinking', this.isThinking, this.slidingWindow.length);
    // "Trend" Logic: Periodic check every window size points
    if (this.nextWindow === this.windowSize && !this.isThinking) {
      // reset the window
      this.nextWindow = 0;
      await this.chat(socket, "ROUTINE TREND ANALYSIS: Report on system stability.");
    }
  }

  async chat(socket, mission) {
    this.isThinking = true;
    try {
      const request = {
        contents: [{ 
          role: 'user', 
          parts: [{ text: `${mission}\nData: ${JSON.stringify(this.slidingWindow)}` }] 
        }],
      };
      let analysis = "";
      const streamingResult = await this.model.generateContentStream(request);

      for await (const item of streamingResult.stream) {
        const chunkText = item.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunkText) {
          analysis += chunkText;
        }
      }
      console.log('Sending data analysis', analysis);
      socket.emit('ai_chat', analysis);


    } catch (err) {
      console.error("Vertex AI Stream Error:", err);
      socket.emit('error', "Quality Engineer reasoning interrupted.");
    } finally {
      this.isThinking = false;
    }
  }
}

module.exports = QualityEngineerAgent;