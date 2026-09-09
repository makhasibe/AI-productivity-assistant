# AI Workplace Productivity Assistant

One dashboard app with five AI tools, a sidebar, and editable results everywhere.

## Pages and navigation

Persistent sidebar (collapses to a drawer on mobile) with:

1. **Overview** — short intro, tool cards, responsible-AI notice.
2. **Email Writer** — recipient, purpose/context, tone selector (Professional, Friendly, Persuasive, Concise, Apologetic, Assertive), length. Output is an editable subject + body with copy and regenerate.
3. **Meeting Notes** — paste raw notes or transcript, plus meeting title and attendees. Output is four labelled blocks: Summary, Action Items (owner + task), Decisions, Deadlines. All editable, copy-all button.
4. **Task Planner** — task list input, working hours, energy/focus preference, date. Output is a prioritized list with reasons plus a time-blocked schedule table. Editable.
5. **Research Assistant** — topic, optional pasted source text, depth selector. Output: Key Insights, Takeaways, Recommendations, Open Questions. Editable, with a note that facts should be verified.
6. **Assistant Chat** — contextual chatbot that streams answers and knows the user's recent work from the other tools.

## AI behaviour

- Lovable Cloud is enabled for the backend; Lovable AI powers every generation.
- Each tool has its own carefully written system prompt with role, output structure, and quality rules, so results come back in a consistent shape the UI can lay out into labelled sections.
- Chat streams token by token, keeps the full conversation, and renders markdown.
- Generations and chat threads are saved per signed-in user so history survives a refresh; sign-in with email and password.
- Clear error messages for rate limits and exhausted AI credits, never a silent failure.

## Responsible AI

- Persistent short disclaimer under every generated result: AI can be wrong, review before sending or acting.
- Overview page has a guidance panel: don't paste secrets or personal data, verify facts, you are accountable for what you send.

## Design

Modern SaaS look: calm slate/indigo palette with one accent, generous spacing, card-based results, skeleton loading states, fully responsive from phone to wide desktop. All colours as design tokens, dark mode supported.

## Technical notes

- TanStack Start routes: `/`, `/email`, `/meetings`, `/planner`, `/research`, `/chat`, plus `/auth`, all under a shared sidebar layout.
- Lovable Cloud (Supabase) tables: `generations` (tool, inputs, output, user_id) and chat `threads` + `messages`, all with RLS scoped to `auth.uid()` and explicit grants.
- Structured tools call Lovable AI via a `createServerFn` with a strict output schema; chat uses a streaming `/api/chat` server route with the AI SDK and AI Elements UI components.
- Every route gets its own title/description/OG metadata.

## Verification

Run each of the five tools end to end against the live preview, confirm outputs render into their labelled sections, are editable, persist across reload, and that the chat streams.
