# ROVAWRIST.bot.1

## Nima qiladi

- `/start` bosgan foydalanuvchilarni `Start` topic'iga log qiladi
- Pastki menyuda `O‘zbek`, `Русский`, `English` til tugmalari doim ko‘rinadi
- `/start`dan keyin `@dioranalitika` kanaliga aʼzo bo‘lishni talab qiladi
- Kanal oynasida kanallar alohida qatorda va eng pastda `Tekshirish` tugmasi chiqadi
- Obuna tasdiqlangandan keyin pastda `Buyurtma berish` tugmasini ko‘rsatadi
- `/buy` yoki `Buyurtma berish` tugmasi orqali buyurtma oqimini boshlaydi
- Qora va pushti ROVA braslet rasmlarini bitta yonma-yon rasm ko‘rinishida chiqaradi
- Rasm tagida narx, eslatma va xususiyatlarni ko‘rsatadi
- Mahsulot qismida faqat rang tanlash tugmalari chiqadi
- Rang tugmasi bosilgach, telefon, ism-familiya va manzil/lokatsiya so‘rab buyurtma rasmiylashtiriladi
- Manzil bosqichida matn, joriy joylashuv (📍 tugma) yoki Telegram’ning skrepka (📎) → Location orqali xaritadan qo‘lda belgilangan aniq nuqta qabul qilinadi
- Agar foydalanuvchi kanaldan chiqib ketsa, bot yana aʼzolikni tekshiradi
- Mahsulot, ism, telefon, manzil va izohni Telegram ichida yig‘adi
- Buyurtmani `Buyurtmalar` topic'iga yuboradi
- `/admin`, `/help`, `/halp` orqali support oqimini ishlatadi
- Xatolarni `Error` topic'iga yuboradi

## Ishga tushirish

```bash
npm install
npm run check
npm start
```

## Sozlamalar

1. `.env.example` dan nusxa olib `.env` yarating
2. Bot token, log group ID, topic ID lar va kanal maʼlumotlarini yozing
3. `npm run check` bilan konfiguratsiyani tekshiring
4. Botni ishga tushiring

## GitHub / deploy uchun tavsiya

- `.env` va `data/` ichidagi ishchi fayllar `.gitignore` ga qo‘shilgan
- Deploydan oldin `npm run check` ni muvaffaqiyatli o‘tkazing
- Bir serverda botning faqat bitta nusxasini ishlating
- Agar eski process qolib ketgan bo‘lsa, yangi deploydan oldin uni to‘xtating

## Sayt bilan aloqa

Sayt foydalanuvchini `https://t.me/rovawrist_bot?start=buy` yoki mahsulotga mos deep-link orqali shu botga olib keladi.

## Xaritadan qo‘lda manzil belgilash

Foydalanuvchi joriy joylashuvidan boshqa (aniq) manzilni yubormoqchi bo‘lsa, alohida sayt yoki xizmat kerak emas — Telegram’ning o‘zidagi imkoniyat ishlatiladi: xabar oynasidagi skrepka (📎) belgisi → **Location** → xaritada kerakli nuqtani bosib/surib belgilash → **Send Selected Location**. Bot bu tanlovni oddiy lokatsiya sifatida qabul qiladi. Pastdagi "📍 Joriy joylashuvni yuborish" tugmasi esa har doim foydalanuvchining hozirgi turgan joyini yuboradi — bu ikkisi manzil bosqichi promptida aniq tushuntirilgan.
