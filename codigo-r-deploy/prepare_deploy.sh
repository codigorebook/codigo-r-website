#!/bin/bash

echo "🚀 Preparando seu site para o mundo..."

# Criar build do frontend
echo "📦 Construindo frontend..."
cd frontend
yarn build
cd ..

# Verificar se tudo está OK
echo "✅ Verificando arquivos..."
if [ -d "frontend/build" ]; then
    echo "✅ Frontend build criado com sucesso!"
else
    echo "❌ Erro no build do frontend"
    exit 1
fi

if [ -f "backend/server.py" ]; then
    echo "✅ Backend encontrado!"
else
    echo "❌ Backend não encontrado"
    exit 1
fi

echo "🎉 Tudo pronto para deploy!"
echo "📋 Próximos passos:"
echo "1. Criar repositório no GitHub"
echo "2. Fazer push do código"
echo "3. Deploy no Railway (backend)"
echo "4. Deploy no Vercel (frontend)"
echo ""
echo "📖 Consulte DEPLOY_GUIDE.md para instruções detalhadas"