@echo off
REM Passo 1 - Build
echo Executando build...
call npm run build

REM Passo 2 - Package
echo Executando package...
call npm pack

REM Passo 3 - Copiar arquivo JAR
echo Copiando arquivo tgz...
move "cortexsdk-frontend-1.0.0.tgz" "..\..\..\..\Frontend\ecommerce-app\libs" 
/Y


echo Processo concluído com sucesso!
pause