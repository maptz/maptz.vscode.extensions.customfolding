cd %~dp0/src/
for /f "delims=" %a in ('mgetvar VSCodePersonalAccessToken') do @set accesscode=%a
vsce publish -p %AccessCode%