#!/bin/bash

echo "========================================="
echo "   GitHub'a Yükleme Scripti"
echo "========================================="
echo ""

# GitHub kullanıcı adını sor
read -p "GitHub kullanıcı adınız: " username

# Repo adını sor
read -p "GitHub repo adı (varsayılan: canli-dinleme-app): " reponame
reponame=${reponame:-canli-dinleme-app}

# Remote ekle
git remote add origin https://github.com/$username/$reponame.git

# Branch'i main yap
git branch -M main

# Push et
echo ""
echo "GitHub'a yükleniyor..."
git push -u origin main

echo ""
echo "✅ Yükleme tamamlandı!"
echo ""
echo "========================================="
echo "📱 Uygulamanız hazır!"
echo "========================================="
echo ""
echo "🌐 GitHub Pages'i aktifleştirmek için:"
echo "1. https://github.com/$username/$reponame/settings/pages adresine gidin"
echo "2. Source: Deploy from a branch"
echo "3. Branch: main"
echo "4. Folder: / (root)"
echo "5. Save'e tıklayın"
echo ""
echo "Birkaç dakika sonra uygulamanız şu adreste yayında olacak:"
echo "https://$username.github.io/$reponame"
echo ""