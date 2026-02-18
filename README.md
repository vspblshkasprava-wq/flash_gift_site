# flash.gift — starter site (with GA4 + Yandex Metrika)

Этот архив подготовлен под:
- GitHub Pages (статический сайт)
- домен flash.gift (через Namecheap DNS)
- Google Search Console (URL Prefix) — мета-тег уже вставлен
- Google Analytics 4 — код уже вставлен (Measurement ID: G-6ZCB0PFQHC)
- Yandex.Metrika — код уже вставлен (Counter ID: 106882540)

## Что уже вставлено
1) Google Search Console (URL Prefix) meta tag:
   google-site-verification = k3p72DOG4IY43Zcxgk-vc1v0iFhsL73uqDpdBK9BLhQ

2) GA4:
   G-6ZCB0PFQHC

3) Yandex.Metrika:
   106882540

## Как развернуть на GitHub Pages
1) Создайте репозиторий на GitHub (например: flash-site).
2) Загрузите все файлы из архива в корень репозитория.
3) GitHub → Settings → Pages → Deploy from a branch → main /root.
4) В Pages добавьте Custom Domain: flash.gift и включите Enforce HTTPS.

## DNS в Namecheap (для GitHub Pages)
Advanced DNS → Host Records:
- 4x A record для @:
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
- CNAME для www → <your_github_username>.github.io

## Поддомен бота
A record:
- bot → 176.197.150.150

## Google Search Console: Domain property (через DNS TXT)
1) Search Console → Add property → Domain → flash.gift
2) Google покажет TXT вида:
   google-site-verification=XXXXXXXXXXXX
3) Добавьте в Namecheap:
   TXT record, Host=@, Value=google-site-verification=XXXXXXXXXXXX
4) Проверьте командой:
   nslookup -type=TXT flash.gift 8.8.8.8
5) Нажмите Verify в Search Console.

## robots.txt и sitemap.xml
- robots.txt разрешает индексацию и указывает карту сайта
- sitemap.xml уже добавлен и содержит 3 страницы
