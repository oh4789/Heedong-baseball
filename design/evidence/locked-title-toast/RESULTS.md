# Locked-title toast smoke — 2026-09-14

Bug: design `run-meta-ui-v1` says locked card tap → toast `아직 잠겨 있어요`, but `say()` wrote `#feedback` under the native `<dialog>` top-layer (invisible).

Fix: in-dialog `.titles-toast` inside `dialog.titles-dialog`.

Viewport: 390×844 · **11/11 PASS**

| Step | Result | Detail |
|---|---|---|
| title chip visible | PASS |  |
| catalog open with locked cards | PASS | {"open":true,"locked":4,"toastEl":true} |
| titles-toast element present | PASS |  |
| toast text 아직 잠겨 있어요 | PASS | {"text":"아직 잠겨 있어요","hidden":false,"show":true,"opacity":"0.992938","width":314,"height":41.1875,"top":539.4188842773438 |
| toast visible (show + opacity) | PASS | {"text":"아직 잠겨 있어요","hidden":false,"show":true,"opacity":"0.992938","width":314,"height":41.1875,"top":539.4188842773438 |
| toast not relying on #feedback | PASS | fb= |
| keyboard Enter shows toast | PASS |  |
| close catalog clears toast | PASS | {"open":false,"toastHidden":true} |
| reopen starts without toast | PASS |  |
| start CTA still visible | PASS |  |
| header titles-open over start | PASS |  |

Screenshots: `01-catalog-before-toast.png`, `02-locked-toast-visible.png`, `03-reopen-no-toast.png`
