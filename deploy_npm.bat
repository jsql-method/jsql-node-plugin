@echo off
@chcp 1250 >nul
ECHO Po pojawieniu si� "Username" podaj login do rejestru NPM
CALL npm login

ECHO Jestes poprawnie zalogowany jako:
CALL npm whoami

ECHO.
ECHO Po zapisaniu zmian w notatniku wr�c do konsoli i wci�nij enter
REM Otwiera notepad aby zmieni� wersje ####################################
notepad package.json

ECHO Po wci�ni�ciu enter zmiany b�d� publikowane w rejestrze NPM
ECHO.
pause >nul
ECHO Zmiany s� teraz publikowane w rejestrze NPM
CALL npm install
CALL build.bat
CALL npm publish

REM wylogowuje ############################################################
CALL npm logout

ECHO.
ECHO Nacisnij aby zako�czy�
pause >nul
cd ..