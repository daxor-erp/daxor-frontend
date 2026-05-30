# E2E flow documentation

Source PDFs live in **`flows/`** (see `flows/README.md`).

## Sales flow images

```bash
npm run e2e:pdf-images
```

Reads `flows/sales-flow.pdf` and writes `e2e/docs/sales-flow/page-*.png`.

Other flows:

```bash
npm run e2e:pdf-images -- flows/crm-flow.pdf e2e/docs/crm-flow
```

## Run tests

```bash
npm run test:e2e:sales   # flows/sales-flow.pdf → e2e/sales-flow.spec.ts
npm run test:e2e:auth
```

Credentials: copy `.env.e2e.example` → `.env.e2e.local` (gitignored). Org admin: `diokid@gmail.com` / `diokid`.
