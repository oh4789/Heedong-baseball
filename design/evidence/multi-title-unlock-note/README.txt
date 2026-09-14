P3 polish: multi-title unlock note (2026-09-14)
Bug: TitleBook.noteDailyClear() → evaluate() replaced lastNewUnlocks from noteRun,
so wipe→daily stage_2 clear with first PERFECT only showed 「일일 타자」 (not 「첫 퍼펙트」).
Fix: merge previous lastNewUnlocks in noteDailyClear.
Smoke: 8/8 PASS — both titles listed, daily 칭호 해금 on first clear, continue no false suffix, locked toast.
