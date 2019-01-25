@ECHO OFF
REM You need to make sure you've got an up to date PersonalAccessToken from VSTS 
REM https://maptz.visualstudio.com/
REM Then go to Security (https://maptz.visualstudio.com/_details/security/tokens)

set location=%cd%
cd /D "%~dp0/../"
echo %cd%

 FOR /F "delims=" %%i in ('menv get VSCodePersonalAccessToken')  do @set accesscode=%%i
echo publishing with accesscode %AccessCode%
vsce publish -p %AccessCode%
cd /D %location%