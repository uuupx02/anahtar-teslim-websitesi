<?php
/**
 * XipSoft — teklif formu işleyicisi
 *
 * Formdan gelen verileri doğrular ve e-posta olarak gönderir.
 * Yanıt her zaman JSON'dur; main.js bu yanıtı okuyup mesaj gösterir.
 *
 * Kurulum: aşağıdaki $alici adresini kendi e-posta adresinizle değiştirin.
 * Not: Sunucuda mail() fonksiyonu kapalıysa SMTP kütüphanesi (PHPMailer vb.)
 * kullanmanız gerekir.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$alici = 'merhaba@xipsoft.net'; // TODO: kendi e-posta adresinizi yazın
$gonderen = 'no-reply@xipsoft.net'; // Alan adınıza ait bir adres olmalı

/** JSON yanıtı döndürüp betiği bitirir. */
function yanitla(int $kod, bool $ok, string $mesaj): void
{
    http_response_code($kod);
    echo json_encode(
        ['ok' => $ok, 'message' => $mesaj],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    yanitla(405, false, 'Bu adres yalnızca POST isteklerini kabul eder.');
}

// Bal küpü (honeypot): botlar bu alanı doldurur, insanlar görmez.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    yanitla(200, true, 'Mesajınız alındı. En kısa sürede dönüş yapacağız.');
}

$ad      = trim((string) ($_POST['ad'] ?? ''));
$eposta  = trim((string) ($_POST['eposta'] ?? ''));
$hizmet  = trim((string) ($_POST['hizmet'] ?? 'Diğer'));
$mesaj   = trim((string) ($_POST['mesaj'] ?? ''));

$izinli_hizmetler = [
    'Kurumsal Web Sitesi',
    'E-Ticaret',
    'Landing Page',
    'Kişisel Site & Blog',
    'Özel Panel',
    'Bakım & Destek',
    'Diğer',
];

if (!in_array($hizmet, $izinli_hizmetler, true)) {
    $hizmet = 'Diğer';
}

// Satır sonları başlık enjeksiyonuna yol açabilir; temizle.
$ad = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $ad);

if (mb_strlen($ad) < 2 || mb_strlen($ad) > 80) {
    yanitla(422, false, 'Lütfen geçerli bir ad soyad girin.');
}

if (!filter_var($eposta, FILTER_VALIDATE_EMAIL) || mb_strlen($eposta) > 120) {
    yanitla(422, false, 'Lütfen geçerli bir e-posta adresi girin.');
}

if (mb_strlen($mesaj) < 10) {
    yanitla(422, false, 'Proje detayı en az 10 karakter olmalı.');
}

if (mb_strlen($mesaj) > 2000) {
    $mesaj = mb_substr($mesaj, 0, 2000);
}

$konu = 'Yeni teklif talebi — ' . $ad . ' (' . $hizmet . ')';

$govde = "Yeni teklif talebi\n"
    . "========================\n\n"
    . "Ad Soyad : {$ad}\n"
    . "E-posta  : {$eposta}\n"
    . "Hizmet   : {$hizmet}\n"
    . "Tarih    : " . date('d.m.Y H:i') . "\n\n"
    . "Mesaj:\n{$mesaj}\n\n"
    . "========================\n"
    . "IP: " . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";

$basliklar = [
    'From: XipSoft Web <' . $gonderen . '>',
    'Reply-To: ' . $eposta,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: XipSoft-Form/1.0',
];

$encoded_subject = '=?UTF-8?B?' . base64_encode($konu) . '?=';
$sent = @mail($alici, $encoded_subject, $govde, implode("\r\n", $basliklar));

if (!$sent) {
    yanitla(500, false, 'Mesaj gönderilemedi. Lütfen Telegram üzerinden iletişime geçin.');
}

yanitla(200, true, 'Teşekkürler! Mesajınız alındı, genellikle 1 iş günü içinde dönüş yapıyoruz.');
