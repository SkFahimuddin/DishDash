require('dotenv').config();

console.log('Testing OpenAI Configuration...\n');
console.log('Environment Variables:');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? `Found (${process.env.OPENAI_API_KEY.substring(0, 10)}...)` : '❌ NOT FOUND');
console.log('\nAPI Key Type:', typeof process.env.OPENAI_API_KEY);
console.log('API Key Length:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0);

const axios = require('axios');

async function testOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('\n❌ ERROR: OPENAI_API_KEY is not set!');
    console.log('\nCreate a .env file in the backend folder with:');
    console.log('OPENAI_API_KEY=sk-your-key-here');
    return;
  }

  try {
    console.log('\n🔄 Testing OpenAI API...');
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: 'Say "Hello, API is working!"' }
        ],
        max_tokens: 20
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    console.log('✅ SUCCESS! OpenAI API is working!');
    console.log('Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('❌ ERROR:', error.response?.data || error.message);
  }
}

testOpenAI();