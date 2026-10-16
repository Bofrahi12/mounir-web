# دليل تعديل موقع «فيرتكس ويب»

ملف مرجعي سريع: كيف تعدّل المشاريع والأسعار والمحتوى بدون كسر الموقع.
الموقع: https://bofrahi12.github.io/mounir-web/ · المصدر: مجلد `mounir-web/`

## بنية الملفات
- `index.html` — الصفحة الرئيسية (هيرو، لماذا نحن، الخدمات، أعمال مختارة، الأسعار، طريقة العمل، الأرقام، الشهادات، FAQ، النموذج، CTA).
- `portfolio.html` — معرض الأعمال الكامل + دراسات الحالة (نوافذ).
- `styles.css` — كل التنسيقات (الأقسام الجديدة في الأسفل تحت `v4 marketing rebuild`).
- `script.js` — القائمة، FAQ، النموذج، تتبع الأحداث (`trackEvent`).
- `shots/` — لقطات المشاريع (`.webp` للعرض + `.jpg` أرشيف).
- `logo-icon.svg` — الشعار · `og-image.jpg` — صورة المشاركة · `sitemap.xml` + `robots.txt` — SEO.

## تعديل الأسعار
في `index.html` ابحث عن `id="pricing"`: كل باقة بطاقة `.price` فيها:
- الثمن داخل `.amount`
- المحتويات في `ul.incl` (كل سطر `<li>✓ ...</li>`)
- الاستثناءات في `p.excl`
زرّ الباقة فيه `data-service` = نص نوع المشروع الذي سيظهر في نموذج الطلب.

## إضافة مشروع جديد إلى المعرض
1. خذ لقطة شاشة للموقع (1280×800) واحفظها في `shots/NAME.jpg` ثم حوّلها إلى WebP بنفس الاسم.
2. في `portfolio.html` انسخ أي بطاقة `.wcard` وعدّل: الرابط، الصورة، الاسم، الوصف، المزايا، الوسم:
   - مشروع حقيقي: `<span class="tag tag-live">مشروع منشور</span>` أو `منصة حية`
   - نموذج: `<span class="tag tag-demo">نموذج تجريبي</span>`
3. حدّد `data-cat`: `real` (حقيقي) / `demo` (نموذج قطاعي) / `client` (نموذج لنشاط حقيقي).
4. حدّد `data-sector` بقيم من: `resto stores immo sante voyage sport services plateformes` (يمكن قيمتان بمسافة).
5. حدّث العدد الإجمالي في: عنوان الصفحة، إحصائيات الهيرو، وزر المعرض في `index.html`.

## إضافة دراسة حالة
في `portfolio.html`، كائن `CASES` في آخر سكربت: أضف مفتاحاً جديداً بنفس البنية
(العنوان، القطاع، المشكلة، الهدف، الحل، الوظائف، رابط الموقع)، ثم أضف داخل بطاقة المشروع:
`<span class="details-btn" data-case="المفتاح" role="button" tabindex="0">🔎 شاهد تفاصيل المشروع</span>`

## تعديل الشهادات
في `index.html` قسم `id="avis"`: انسخ بطاقة وعدّل النص والاسم والنشاط.
⚠️ قاعدة ثابتة: لا تنشر إلا شهادة حقيقية أثبتها صاحب المشروع.

## تفعيل التحليلات (GoatCounter)
في `script.js` غيّر `TW_GOATCOUNTER` من `''` إلى رمز الحساب (مثلاً `'tanjaweb'`).
الأحداث المُتتبَّعة تلقائياً: `whatsapp_click`, `email_click`, `form_start`, `form_submit`,
`service_select`, `pricing_cta`, `cta_works`, `cta_portfolio`, `work_card`, `portfolio_filter`, `case_open`.
بدون رمز، تُسجَّل الأحداث في `window.dataLayer` فقط.

## النشر
```
python3 ~/workspace/skills/github/bin/gh-pages-deploy.py push mounir-web ~/workspace/mounir-web localboost
```
انتظر 1–3 دقائق ثم تحقق من الروابط (200) قبل إعلان أي تغيير.
