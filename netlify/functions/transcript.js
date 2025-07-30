// netlify/functions/transcript.js (CÓDIGO CORRIGIDO)
const { YoutubeTranscript } = require('youtube-transcript');

exports.handler = async function(event, context) {
  // Define os cabeçalhos de permissão (CORS)
  const headers = {
    "Access-Control-Allow-Origin": "*", // Permite acesso de qualquer origem
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  const { videoId } = event.queryStringParameters;

  if (!videoId) {
    return { 
      statusCode: 400, 
      headers,
      body: JSON.stringify({ error: 'O parâmetro videoId é obrigatório.' }) 
    };
  }

  try {
    // Tenta buscar a transcrição em português
    const transcript = await YoutubeTranscript.fetchTranscript(videoId, { lang: 'pt' });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(transcript),
    };
  } catch (error) {
    // Se falhar, tenta buscar em qualquer outro idioma disponível
    try {
      const anyLangTranscript = await YoutubeTranscript.fetchTranscript(videoId);
       return {
        statusCode: 200,
        headers,
        body: JSON.stringify(anyLangTranscript),
      };
    } catch (finalError) {
      return { 
        statusCode: 500, 
        headers,
        body: JSON.stringify({ error: finalError.message }) 
      };
    }
  }
};