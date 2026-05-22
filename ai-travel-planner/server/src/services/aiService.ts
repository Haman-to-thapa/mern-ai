import Groq from "groq-sdk";

const getGroq = () => new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

const generateItinerary = async (
  text: string
) => {
  const response =
    await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: `You are a travel itinerary JSON generator.

Extract travel info from OCR text and output a JSON object.

RULES:
- Ignore baggage, fares, cancellation policies, ads, noisy text
- Fix obvious OCR typos (e.g. "Nw York" -> "New York", "J0hn" -> "John", "AA12B" -> "AA123")
- Use context to infer correct city names, flight numbers, dates from messy text
- If a field is truly impossible to determine, set it to null
- NEVER use the string "Not detected" — use null instead
- NEVER include flights/hotels arrays if no data found — leave them empty []
- Output ONLY the JSON object. No greetings, no explanations, no markdown, no backticks.

Required format:
{
  "destination": "...",
  "passenger": "...",
  "flights": [
    {
      "airline": "...",
      "flightNumber": "...",
      "from": "...",
      "to": "...",
      "departureDate": "...",
      "departureTime": "...",
      "arrivalTime": "..."
    }
  ],
  "hotels": [],
  "travelDates": { "startDate": "...", "endDate": "..." },
  "dayWiseTimeline": [],
  "summary": "..."
}`,
        },

        {
          role: "user",
          content: `
OCR TEXT:
${text}`,
        },
      ],
    });

  let content = response.choices[0]!.message.content!;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    content = jsonMatch[0];
  }
  return JSON.parse(content);
};

export default generateItinerary;