start-menu-restore smoke (2026-09-14)
PASS:
1. wipe overlay → showStartMenu restores #daily-match #title-chip #start #loadnote + DailyMatch card + start-panel
2. pause has #resume + #to-menu → showStartMenu (game.state ready)
3. end(loss) has #retry + #to-menu; unlock note has title-unlock-note pulse
4. end(win) has upgrades/continue + #to-menu
5. TitleBook chip + #titles-open rebound after restore
