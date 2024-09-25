const audio = document.getElementById('audio');

// Capture audio using getUserMedia
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    
    // Capture audio data for real-time processing
    const processor = audioContext.createScriptProcessor(1024, 1, 1);
    source.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = function(e) {
      const audioData = e.inputBuffer.getChannelData(0);
      
      // Send audio data to backend for real-time processing
      fetch('/process_audio', {
        method: 'POST',
        body: JSON.stringify({ audio: Array.from(audioData) }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(response => response.json())
      .then(data => {
        document.getElementById('speaker-id').textContent = 'Predicted Speaker: ' + data.speaker;
      });
    };
  })
  .catch(err => {
    console.error('Error accessing microphone: ' + err);
  });
