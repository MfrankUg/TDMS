"use server";

/**
 * @fileOverview Translates text to a specified language.
 *
 * - translateText - A function that translates text.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const LANGUAGE_MAP: { [key: string]: string } = {
  en: "English",
  sw: "Swahili",
  lg: "Luganda",
  ru: "Rutooro",
};

const TranslateTextInputSchema = z.object({
  text: z.string().describe("The text to translate."),
  targetLanguage: z.string().describe("The language to translate the text into (e.g., 'sw', 'en', 'lg', 'ru')."),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe("The translated text."),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const translateTextPrompt = ai.definePrompt({
  name: "translateTextPrompt",
  input: { schema: TranslateTextInputSchema },
  output: { schema: TranslateTextOutputSchema },
  prompt: `Translate the following text to {{targetLanguageName}}:

Text: {{{text}}}

Translate the text and provide only the translated text as the output.
`,
});

const translateTextFlow = ai.defineFlow(
  {
    name: "translateTextFlow",
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async (input) => {
    const targetLanguageName = LANGUAGE_MAP[input.targetLanguage] || "English";
    const { output } = await translateTextPrompt({ ...input, targetLanguageName });
    return output!;
  }
);
