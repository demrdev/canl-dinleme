# ❤️ Kalp Dinleme (Eğitsel)

Sadece kalp atışını dinlemek ve BPM (atım/dk) tahmini yapmak için sadeleştirilmiş mobil web uygulaması. Eğitim amaçlıdır, tıbbi kullanım için uygun değildir.

## 🚀 Hemen Kullan

Uygulamayı GitHub Pages’e kurduktan sonra telefondan açabilirsiniz. Aşağıdaki “Yayınlama” bölümüne bakın.

## 🎯 Özellikler

- ✅ Sadece kalp atışına odaklı dinleme
- ✅ Fetal aralık için optimize edilmiş filtreleme (≈60–160 Hz)
- ✅ BPM tahmini ve güven skoru (eğitsel)
- ✅ Mobil uyumlu, kulaklık ile kullanım önerilir

## 📱 Kullanım

1. Siteyi telefonunuzda açın (HTTPS veya GitHub Pages)
2. “Kalp Dinlemeyi Başlat” butonuna dokunun
3. Mikrofon iznini verin
4. Kulaklık takın (geri beslemeyi önlemek için)
5. Güçlendirme (gain) kaydırıcısını ihtiyaca göre ayarlayın

## 🔧 Teknik Detaylar

- Web Audio API ile özel bant geçiren filtreler + dar 50 Hz notch
- 48 kHz, mono, AEC/AGC/NS kapalı giriş kısıtları
- 3 sn halka tampon ile BPM analizi (eğitsel)
- PWA desteği (manifest mevcut), responsive tasarım

## ⚠️ Önemli Notlar

- Bu bir tıbbi cihaz değildir; yalnızca eğitim amaçlıdır.
- Kulaklık kullanın: Geri beslemeyi önlemek için gereklidir.
- HTTPS gerekli: Mikrofon erişimi için şarttır (GitHub Pages uygundur).

## 🛠️ Yerel Geliştirme

```bash
# Repo'yu klonla
git clone https://github.com/[kullanıcı-adınız]/canli-dinleme-app.git

# Klasöre gir
cd canli-dinleme-app

# Local server başlat
python3 -m http.server 8000

# Tarayıcıda aç
# http://localhost:8000

## 🌐 Yayınlama (GitHub Pages)

1. GitHub’da boş bir repo oluşturun (ör. `kalp-dinleme`)
2. Bu klasörde aşağıdakileri çalıştırın:

```bash
git init
git add .
git commit -m "Kalp Dinleme (eğitsel) ilk sürüm"
git branch -M main
git remote add origin https://github.com/<kullanici-adiniz>/<repo-adiniz>.git
git push -u origin main
```

3. GitHub -> Settings -> Pages:
   - Source: Deploy from a branch
   - Branch: `main` / Folder: `/ (root)`
   - Save

4. Yayın adresiniz: `https://<kullanici-adiniz>.github.io/<repo-adiniz>`
```

## 📄 Lisans

MIT

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için önce bir issue açın.

## 👨‍💻 Geliştirici

Arif Edemir

---

**Not:** Bu uygulama eğitim amaçlıdır. Medikal veya profesyonel kullanım için uygun değildir.
