daily PERFECT session accumulate + board entry — Node unit test
===============================================================
Run: node design/evidence/daily-perfect-accumulate/test-session-perfects.js

Cases:
1. startDailyPlay zeros session + activates
2. noteRun({perfects:2,stage:1}) → not cleared (session 2)
3. noteRun({perfects:1,stage:2}) → cleared (session 3) for perfect_3
4. recordBoardEntry({perfects:1}) after session 3 → board stores 3 (not segment 1);
   sessionPerfects unchanged by recordBoardEntry
5. beginNormal resets; inactive noteRun noop; uncleared day / empty nick refuse board
6. new startDailyPlay zeros again
7. stage_2 still clears via stage number

Also covered in production:
- leaderboard.js bindResult passes DailyMatch.sessionPerfects at submit (fallback snapshot)
- result-grid PERFECT display remains segment (game.perfects) — unchanged

Fixture days: 2026-09-01 → perfect_3, 2026-09-14 → stage_2
