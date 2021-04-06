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

REM Full PAT instructoins here: https://code.visualstudio.com/api/working-with-extensions/publishing-extension
REM Personal access token is at https://dev.azure.com/. 
REM See here for instructions https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page
REM See https://dev.azure.com/maptz/_usersSettings/tokens

