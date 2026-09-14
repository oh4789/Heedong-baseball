daily PERFECT session accumulate — Node unit test
================================================
Run: node design/evidence/daily-perfect-accumulate/test-session-perfects.js

Cases:
1. startDailyPlay zeros session + activates
2. noteRun({perfects:2,stage:1}) → not cleared (session 2)
3. noteRun({perfects:1,stage:2}) → cleared (session 3) for perfect_3
4. beginNormal resets; inactive noteRun is noop
5. new startDailyPlay zeros again
6. stage_2 still clears via stage number

Fixture days: 2026-09-01 → perfect_3, 2026-09-14 → stage_2
