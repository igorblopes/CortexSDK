@echo off
REM Passo 1 - Build
echo Executando build...
call npm run build

REM Passo 2 - Package
echo Executando package...
call npm run package

REM Passo 3 - Copiar arquivo JAR
echo Copiando arquivo JAR...
cd D:\Projects\FIAP\Challenge 2\CortexSDK\SDK\src\modules\Backend\distjsii\java\br\com\CortexSDK\Backend-CortexSDK\1.0.0
copy Backend-CortexSDK-1.0.0..jar Backend-CortexSDK-1.0.0.jar
move "Backend-CortexSDK-1.0.0.jar" "D:\Projects\FIAP\Challenge 2\CortexSDK\Backend\CORTEX\libs\" 
cd D:\Projects\FIAP\Challenge 2\CortexSDK\SDK\src\modules\Backend
/Y


echo Processo concluído com sucesso!
pause