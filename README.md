# Anahtar Teslim Websitesi — XipSoft

Kurumsal tanıtım, e-ticaret ve özel panel hizmetleri için tek sayfalık tanıtım sitesi.
Bağımlılık yok; saf **HTML + CSS + JavaScript** ve form gönderimi için küçük bir **PHP** betiği.

🌐 [xipsoft.net](https://xipsoft.net) · 📩 [Telegram: xiplarex](https://t.me/xiplarex)

> **Durum:** Site dosyaları olduğu gibi korunuyor. Bu sürüm doğrudan **xipsoft.net** alan adına bağlanacak şekilde hazırlanmıştır; kod tarafında değişiklik gerekmez, yalnızca hosting yüklemesi ve küçük ayarlar yapılır.

## Yapı

```
anahtar-teslim-websitesi/
├── index.html              # Tüm sayfa içeriği
├── iletisim.php            # Teklif formunu e-posta olarak gönderir
├── assets/
│   ├── css/style.css       # Tema, düzen, animasyonlar, responsive
│   └── js/main.js          # Menü, sayaçlar, scroll animasyonu, form
└── README.md
```

## xipsoft.net’e bağlama

Site statik dosyalardan oluşur; alan adına bağlamak için derleme adımı yoktur. Dosyaları olduğu gibi yüklemek yeterlidir.

### 1. Dosyaları yükle

Hosting paneline (cPanel / Plesk / FTP) girip aşağıdakileri alan adının kök dizinine kopyalayın:

- `index.html`
- `iletisim.php`
- `assets/` klasörü (içindeki `css/` ve `js/` ile birlikte)

Kök dizin genellikle `public_html/` olur. Ana alan adı yerine subdomain kullanılacaksa `public_html/xipsoft.net/` gibi ilgili klasöre yükleyin.

### 2. PHP ve e-posta ayarları

1. `iletisim.php` içindeki `$alici` adresini `merhaba@xipsoft.net` gibi alan adına ait bir adresle değiştirin.
2. `$gonderen` adresinin de alan adına ait olduğundan emin olun (ör. `no-reply@xipsoft.net`); aksi halde e-postalar spam’e düşebilir.
3. Sunucuda **PHP 8+** ve `mail()` fonksiyonunun açık olduğunu kontrol edin.
   `mail()` kapalıysa form SMTP olmadan çalışmaz; PHPMailer gibi bir SMTP kütüphanesine geçin.

### 3. SSL ve yönlendirme

- Hosting panelinden **Let’s Encrypt / AutoSSL** ile HTTPS sertifikasını etkinleştirin.
- HTTP isteklerini HTTPS’e yönlendirin.
- `index.html` içindeki `canonical` ve Open Graph adresleri zaten `https://xipsoft.net` olarak ayarlıdır; alan adı değişirse buraları güncelleyin.

### 4. DNS

Alan adı aynı hostinge bağlıysa ek işlem gerekmez. Farklı bir sunucuya taşınacaksa:

- `A` kaydı → sunucu IP adresi
- `www` için `CNAME` → `xipsoft.net`

Değişikliklerin yayılması birkaç dakika ile 24 saat arasında sürebilir.

### 5. Yayın sonrası kontrol listesi

- [ ] `https://xipsoft.net` açılıyor ve kilit simgesi görünüyor
- [ ] Mobil menü, paket bağlantıları ve Telegram linkleri çalışıyor
- [ ] Form gönderildiğinde e-posta ulaşıyor (ve gerekiyorsa spam klasörü kontrol edildi)
- [ ] `www` ve `www` olmayan adres aynı siteye çıkıyor
- [ ] 404 sayfası ve `robots.txt` isteğe bağlı olarak ekleniyor

## Çalıştırma (yerel)

- **Hızlı önizleme:** `index.html` dosyasını tarayıcıda açın. Sayfa tamamen çalışır;
  yalnızca form gönderimi PHP gerektirdiği için Telegram yönlendirmesine düşer.
- **Formu test etmek için:** PHP 8+ kurulu bir ortamda klasörü servis edin:

  ```bash
  php -S localhost:8000
  ```

  Ardından `http://localhost:8000` adresini açın.

## İçerik notları

- E-posta adresi, fiyatlar ve istatistikler (`index.html` içindeki `data-count` değerleri) örnek metinlerdir; kendi verilerinizle değiştirin.
- İsteğe bağlı: Google Analytics / Search Console ekleyin.

## Bölümler

- **Hero:** değer önerisi, hızlı istatistikler, teknoloji bandı
- **Hizmetler:** kurumsal site, e-ticaret, landing page, kişisel site, özel panel, bakım
- **Paketler:** Başlangıç / Kurumsal / E-Ticaret (başlangıç fiyatları)
- **Süreç:** keşif → tasarım → geliştirme → teslim
- **SSS:** anahtar teslim kapsamı, süre, hosting, panel, ödeme, destek
- **İletişim:** Telegram, web, e-posta ve teklif formu

## Notlar

- Tasarım koyu tema, cam efektli kartlar ve gradyan vurgular üzerine kurulu.
- `prefers-reduced-motion` tercihine saygı duyar; klavye ile tam gezilebilir.
- Mobil menü, aktif bölüm vurgusu ve form doğrulaması JavaScript ile yapılır; JS kapalıyken içerik okunabilir kalır.
