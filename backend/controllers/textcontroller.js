import userModel from '../models/usermodel.js'
import axios from 'axios'

// Simple text generator stub
// If you later integrate a real LLM, replace the body of `createTextFromPrompt`
const createTextFromPrompt = (prompt) => {
  // basic placeholder: echo and add a creative sentence
  return `Here’s a short, creative result for: "${prompt}"\n\n` +
    "In a few words — imagine a vivid scene: " +
    prompt +
    ".\n\nEnjoy your generated text from Pixogenie!`";
}

const generateText = async (req, res) => {
  try {
    const userId = req.user?.id
    const { prompt } = req.body

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' })
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Prompt is required' })
    }

    const User = await userModel.findById(userId)
    if (!User) return res.status(404).json({ success: false, message: 'User not found' })

    if (User.creditBalance <= 0) {
      return res.status(402).json({ success: false, message: 'Insufficient credits' })
    }

    // If an external TEXT_API_KEY is provided, call Google Generative Language API
    let generatedText = null
    let providerError = null
    // Prefer GEMINI_API_KEY (for Gemini/AI Studio keys), but fall back to TEXT_API_KEY or GOOGLE_API_KEY
    const textApiKey = process.env.GEMINI_API_KEY || process.env.TEXT_API_KEY || process.env.GOOGLE_API_KEY
    if (textApiKey) {
      // Note: do NOT attempt the Google SDK here — the Node SDK can require ADC (service account) and
      // may crash the server if credentials are not present. We therefore prefer direct REST calls
      // with an API key (below). If you want SDK usage later, we can add it behind a safe flag.

      // Try a set of possible Google Generative Language endpoints in order
      const candidateEndpoints = [
        // Newer Gemini-style endpoints (v1) — try a couple of likely model names
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateText?key=${textApiKey}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5:generateText?key=${textApiKey}`,
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.0:generateText?key=${textApiKey}`,
        // Backwards-compatible text-bison endpoints (v1 and v1beta2)
        `https://generativelanguage.googleapis.com/v1/models/text-bison-001:generateText?key=${textApiKey}`,
        `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${textApiKey}`
      ]

      const bodyV1 = { prompt: { text: prompt }, temperature: 0.2, maxOutputTokens: 512 }
      const bodyV1beta = { prompt: { text: prompt }, temperature: 0.2, maxOutputTokens: 512 }

      // Try each endpoint until one succeeds
      let apiError = null
      for (const url of candidateEndpoints) {
        try {
          // use the same body shape for these endpoints — many variants accept this payload
          const apiRes = await axios.post(url, bodyV1, { headers: { 'Content-Type': 'application/json' } })
          // Now attempt best-effort extraction of text from any returned shape
          const data = apiRes?.data || {}
          // possible shapes: { candidates: [{ content }] } or { output: [{ content }] } or { candidates: [{ message: { content: { text }}}] }
          const candidateText = data?.candidates?.[0]?.content || data?.candidates?.[0]?.message?.content?.text || data?.output?.[0]?.content || data?.output?.[0]?.text || data?.outputText || data?.text
          if (candidateText) {
            generatedText = candidateText
            console.log('Text API SUCCESS via', url)
            break
          }

          // If the provider returned something else (e.g. chat object) try a generic join
          if (typeof data === 'object') {
            const flattened = JSON.stringify(data).slice(0, 10000)
            if (flattened && flattened.length) {
              generatedText = flattened
              break
            }
          }
        } catch (err) {
          // keep last error to include in the response for debugging
          apiError = err?.response?.data || err?.message || String(err)
          console.warn('Text API failed for', url, apiError)
          // try next endpoint
          continue
        }
      }

      if (!generatedText && apiError) {
        // If all endpoints failed, attach provider error info to logs and to the response
        console.error('External text API call failed for all candidate endpoints — falling back to stub:', apiError)
        // helpful debug info returned to frontend (non-sensitive) so user can see provider response
        // (We DO NOT include API key)
        providerError = apiError
      }
    }

    // generate text via local stub if no external API output available
    if (!generatedText) generatedText = createTextFromPrompt(prompt)

    // decrement credits
    User.creditBalance = Math.max(0, User.creditBalance - 1)
    await User.save()

    const payload = { success: true, message: 'Text generated', generatedText, creditBalance: User.creditBalance }
    if (providerError) payload.providerError = providerError
    return res.json(payload)
  } catch (error) {
    console.error('generateText error:', error)
    return res.status(500).json({ success: false, message: error.message })
  }
}

export default generateText
