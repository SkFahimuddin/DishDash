const axios = require('axios');

class OpenAIService {
  constructor() {
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  // Get API key dynamically instead of in constructor
  getApiKey() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured. Please set OPENAI_API_KEY in your .env file.');
    }
    return apiKey;
  }

  async generateRecipe(query) {
    const apiKey = this.getApiKey(); // Get key when method is called

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful recipe assistant. If the user searches for a specific dish, provide a detailed recipe. If they search for a category, provide a list of 8-10 dishes. Always respond in JSON format.'
            },
            {
              role: 'user',
              content: `Search query: "${query}". If this is a specific dish, provide: {"type": "recipe", "name": "Dish Name", "cuisine": "Cuisine", "prepTime": "X minutes", "cookTime": "X minutes", "servings": X, "difficulty": "Easy/Medium/Hard", "ingredients": [], "instructions": [], "tips": []}. If category: {"type": "category", "category": "Name", "dishes": [{"name": "", "description": "", "difficulty": ""}]}`
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error('Failed to generate recipe');
    }
  }

  async generateSuggestions() {
    const apiKey = this.getApiKey(); // Get key when method is called

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Provide only a JSON array of 6 diverse recipe suggestions. Format: [{"name": "Recipe Name", "cuisine": "Cuisine Type", "description": "Brief description"}]'
            },
            {
              role: 'user',
              content: 'Give me 6 random recipe suggestions from different cuisines'
            }
          ],
          temperature: 0.8
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );

      const content = response.data.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error('Failed to generate suggestions');
    }
  }
}

module.exports = new OpenAIService();