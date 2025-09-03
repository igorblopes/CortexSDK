@echo off
REM Passo 1 - Build
echo Executando build...
call npm run build

REM Passo 2 - Package
echo Executando package...
call npm run package

REM Passo 3 - Copiar arquivo JAR
echo Copiando arquivo JAR...
cd distjsii\java\br\com\CortexSDK\Backend-CortexSDK\1.0.0
copy Backend-CortexSDK-1.0.0..jar Backend-CortexSDK-1.0.0.jar
move "Backend-CortexSDK-1.0.0.jar" "..\..\..\..\..\..\..\..\..\..\..\Backend\CORTEX\libs\" 
cd ..\..\..\..\..\..\..
/Y


echo Processo concluído com sucesso!
pause