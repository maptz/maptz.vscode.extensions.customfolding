@ECHO OFF
REM cd %~dp0/src/
FOR /F "delims=" %%i in ('mgetvar VSCodePersonalAccessToken')  do @set accesscode=%%i
vsce publish -p %AccessCode%