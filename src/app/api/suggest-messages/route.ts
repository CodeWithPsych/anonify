import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { text } = await generateText({
            model: google('gemini-2.0-flash', {
                useSearchGrounding: true,
            }),
            prompt:
            'These questions are for an anonymous social messaging platform like Qooh.me.' +
            'They should be suitable for a diverse audience and avoid personal or sensitive topics.' +
            'Focus on universal themes that encourage friendly interaction.' +
            'Structure your output like this: "What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?".' +
            'Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.' +
            'Return the questions separated **only** by "||", with no punctuation marks , no question marks or any other symbols between them. The output should **not include any explanation or introduction**.'
        
        
        })

        return NextResponse.json({ result: text })
    } catch (error) {
        console.error("Error generating text:", error)
        const defaultMessages = "What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?";
        return NextResponse.json({ result: defaultMessages, error: "Failed to fetch suggested messages" }, { status: 500 })
    }
}
