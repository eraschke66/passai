# Dashboard Deployment - Important Notes

## 🚨 Single File Requirement

**Supabase Dashboard Edge Function deployment only supports single files.**

When deploying via the dashboard:
- ✅ Each function must be self-contained in a single `index.ts` file
- ❌ Cannot use `_shared/` folder with relative imports
- ❌ Multiple files per function are not supported

## 📁 Revised Structure

```
supabase/functions/
├── _shared/              ⚠️  Reference only - not deployable
│   ├── cors.ts           📄 Copy into each function
│   ├── types.ts          📄 Copy into each function
│   ├── auth.ts           📄 Copy into each function
│   ├── errors.ts         📄 Copy into each function
│   └── openai.ts         📄 Copy into each function
│
├── test/
│   └── index.ts          ✅ Self-contained (deploy this)
│
├── generate-quiz/
│   └── index.ts          🔜 Will be self-contained
│
└── grade-response/
    └── index.ts          🔜 Will be self-contained
```

## 🔧 How to Use _shared Utilities

The `_shared/` folder contains reusable code snippets. When creating a new Edge Function:

1. **Copy the utilities you need** from `_shared/` files
2. **Paste them at the top** of your function's `index.ts`
3. **Deploy the single file** via dashboard

### Example Structure:

```typescript
// ============================================================================
// INLINE UTILITIES (from _shared/)
// ============================================================================

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Auth validation
async function validateAuth(req: Request) {
  // ... auth logic from _shared/auth.ts ...
}

// OpenAI client
function getOpenAIClient() {
  // ... OpenAI setup from _shared/openai.ts ...
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req) => {
  // Your function logic here
})
```

## 📝 Deployment Checklist

Before deploying each function:

- [ ] All utilities are inlined (no relative imports to `_shared/`)
- [ ] CORS headers are included
- [ ] Auth validation is present (if required)
- [ ] Error handling returns proper JSON responses
- [ ] Function is in a single `index.ts` file
- [ ] Ready to copy/paste into Supabase dashboard

## 💡 Benefits of This Approach

✅ **Works with dashboard deployment** (no CLI needed)  
✅ **Self-contained** - each function has everything it needs  
✅ **Easy to deploy** - just copy/paste one file  
✅ **Easy to debug** - all code visible in one place  

## ⚠️ Trade-offs

❌ **Code duplication** - utilities copied into each function  
❌ **Harder to update** - changes need to be made in multiple places  
❌ **Larger files** - each function includes all utilities  

**But:** This is the only way to deploy via dashboard without CLI setup.

## 🎯 Current Status

- ✅ **test function** - Restructured as single file, ready to deploy
- 🔜 **generate-quiz** - Will be created as single file
- 🔜 **grade-response** - Will be created as single file

---

**Keep `_shared/` folder as reference/template code for building new functions!**
