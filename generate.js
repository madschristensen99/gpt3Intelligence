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

    // Get the animal name from the request body or set it to an empty string
    const objective = req.body.animal || '';

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
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            });
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error(`Error with OpenAI API request: ${error.message}`);
            throw error;
        }
    }
    const phases = [

        {
            name: "feasability",
            prompt: "Create an overview of a project that fulfills these objectives: ",
        },
        {
            name: "conOps",
            prompt: "Generate a series of directions for an LLM to follow based on the following project overview: ",
        },
        // Add more phases here...
        
    ];
    
    var testPrompt = "Generate an objectives tree for the given system: " + objective;
    const completion = await queryAPI(testPrompt);
    let currentOutput = completion; // Set the initial output to the objectives tree
    console.log(currentOutput);
    for (const phase of phases) {
        const phasePrompt = phase.prompt + currentOutput;
        console.log(`Processing phase: ${phase.name}`);
        currentOutput = await queryAPI(phasePrompt);
        console.log(currentOutput);
    }
    
    /*
    const continuation = await queryAPI(feasabilityPrompt);
    console.log(continuation);
    const conOps = await queryAPI(conOpsPrompt);
    const productTree = await queryAPI(productTreePrompt);
    const requirements = await queryAPI(requirementsPrompt);
    */
    res.status(200).json({ result: completion });
}
