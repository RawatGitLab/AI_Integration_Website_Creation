import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

async function main() {
  const { text } = await generateText({
    model: groq('llama-3.3-70b-versatile'),
    prompt: 'Act aas full stack developer and create a responsive website',
  });

  console.log(text);
}

main().catch(console.error);
