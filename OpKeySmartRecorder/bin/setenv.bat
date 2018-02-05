@echo off
setx OPKEY_HOME %1
md "%userprofile%\CresTech"
md "%userprofile%\CresTech\Opkey"
echo %1> "%userprofile%\CresTech\OpKey\opkeyinstall.dat"
echo Setting the port details
start /B /D  ""%1\bin"" start.bat

