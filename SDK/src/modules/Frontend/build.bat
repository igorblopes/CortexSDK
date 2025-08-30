@echo off
REM Passo 1 - Build
echo Executando build...
call npm run build

REM Passo 2 - Package
echo Executando package...
call npm pack

REM Passo 3 - Copiar arquivo JAR
echo Copiando arquivo tgz...
cd D:\Projects\FIAP\Challenge 2\CortexSDK\SDK\src\modules\Frontend
move "cortexsdk-frontend-1.0.0.tgz" "D:\Projects\FIAP\Challenge 2\CortexSDK\Frontend\ecommerce-app\libs" 
cd D:\Projects\FIAP\Challenge 2\CortexSDK\SDK\src\modules\Frontend
/Y


echo Processo concluído com sucesso!
pause