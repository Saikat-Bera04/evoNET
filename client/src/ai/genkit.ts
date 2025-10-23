// Guarded genkit initialization: when no Google/Gemini API key is provided,
// export a lightweight no-op `ai` object so the Next dev server and server
// actions don't crash during local development. To enable real models,
// set GEMINI_API_KEY or GOOGLE_API_KEY in your environment (for Google)
// or CLAUDE_API_KEY + ENABLE_CLAUDE_SONNET=true for Claude (requires
// the appropriate Genkit Anthropic plugin and API key).

function createNoopAi() {
  return {
    definePrompt: (_spec: any) => {
      // returns an async function that mimics the genkit prompt invocation
      return async (input: any) => {
        return { output: `GENKIT_NO_API_KEY: input=${JSON.stringify(input)}` };
      };
    },
    defineFlow: (_config: any, handler: any) => {
      // returns a function that simply runs the provided handler; if the
      // handler calls prompts they will be the no-op prompts above.
      return async (input: any) => {
        try {
          return await handler(input);
        } catch (err) {
          // surface errors but avoid crashing the server
          console.error('genkit noop flow handler error:', err);
          throw err;
        }
      };
    },
  } as const;
}

const _hasGoogleKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
const _enableClaude = process.env.ENABLE_CLAUDE_SONNET === 'true';
const _hasClaudeKey = Boolean(process.env.CLAUDE_API_KEY);

let _ai: any;
try {
  if (_hasGoogleKey) {
    // Dynamic require so bundlers don't attempt to load genkit at build time
    // when environment isn't configured.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { genkit } = require('genkit');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { googleAI } = require('@genkit-ai/google-genai');

    const model = _enableClaude && _hasClaudeKey ? 'claude/sonnet-3.5' : 'googleai/gemini-2.5-flash';
    const plugins = _enableClaude && _hasClaudeKey ? [] : [googleAI()];

    _ai = genkit({ plugins, model });
  } else if (_enableClaude && _hasClaudeKey) {
    // User explicitly enabled Claude and provided a key, but we don't have
    // an Anthropic plugin installed in this template. Fall back to noop
    // while warning the developer to install/configure the proper plugin.
    console.warn('ENABLE_CLAUDE_SONNET=true but Anthropic/Claude plugin is not configured; using noop ai.');
    _ai = createNoopAi();
  } else {
    console.warn('Genkit: no GEMINI_API_KEY/GOOGLE_API_KEY found; exporting noop ai for local development.');
    _ai = createNoopAi();
  }
} catch (err) {
  console.error('Error initializing genkit; exporting noop ai. Error:', err);
  _ai = createNoopAi();
}

export const ai = _ai;
