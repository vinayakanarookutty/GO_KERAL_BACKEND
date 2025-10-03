@echo off
echo Installing Voice & Chatbot Dependencies...

npm install @google-cloud/speech @google-cloud/text-to-speech @google-cloud/translate
npm install openai socket.io @nestjs/websockets @nestjs/platform-socket.io
npm install node-nlp compromise natural langdetect
npm install @types/multer fluent-ffmpeg

echo Dependencies installed successfully!
pause