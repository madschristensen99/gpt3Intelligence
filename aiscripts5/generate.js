// Import the necessary modules from the "openai" package
import { Configuration, OpenAIApi } from "openai";

// Create a configuration object with the API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize the OpenAI API client with the configuration object
const openai = new OpenAIApi(configuration);

// Export the default async function to handle API requests and responses
export default async function (req, res) {
    // Check if the API key is present in the configuration
    if (!configuration.apiKey) {
        // Return a 500 error if the API key is missing
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }

    // Get the objective name from the request body or set it to an empty string
    const objective = req.body.objective || '';

    // Check if the input objective name is valid (not an empty string)
    if (objective.trim().length === 0) {
        // Return a 400 error if the input is invalid
        res.status(400).json({
            error: {
                message: "Please enter a valid objective",
            }
        });
        return;
    }

    async function queryAPI(prompt) {
      try {
        const response = await openai.createCompletion({
          model: "text-davinci-002",
          prompt: prompt,
          max_tokens: 2000,
          n: 1,
          stop: null,
          temperature: 0.5
        });
        return response.data.choices[0].text.trim();
      } catch (error) {
        console.error(`Error with OpenAI API request: ${error.message}`);
        throw error;
      }
    }
    const phases = {
      "Concept Development Process": [
        "Identify needs and opportunities",
        "Define objectives"
      ],
      "Requirements Analysis process": [
        "Identify stakeholders",
        "Gather and document requirements"
      ],
      "System Design Process": [
        "Define the problem",
        "Gather requirements",
        "Design the solution",
        "Implement the solution",
        "Test the system"
      ],
      // Add stages for other phases
    };
    
    async function generatePhaseStagePrompt(phase, stage, objective) {
      const prompt = `You are a system that develops systems. Your current objective is to design a "${objective}". Provide a detailed and specific prompt for the ${stage} of the ${phase} that will guide the AI to generate more insightful and useful output for the given system development task.`;
    
      const generatedPrompt = await queryAPI(prompt);
      return generatedPrompt;
    }
    
    const results = {};
    
    for (const phase in phases) {
      results[phase] = {};
      for (const stage of phases[phase]) {
        const generatedPrompt = await generatePhaseStagePrompt(phase, stage, objective);
        console.log(`Generated prompt for ${stage} of ${phase}: ${generatedPrompt}`);
        results[phase][stage] = await queryAPI(generatedPrompt);
        console.log(results[phase][stage]);
      }
    }
    
    res.status(200).json({ result: results });
    
}
