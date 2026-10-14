#!/usr/bin/env python3
"""Build the Studio Nojom demo from the DAN template (onepage-personal variant)."""
import os, shutil, re
from PIL import Image

SRC = os.path.expanduser("~/workspace/templates/DAN-Template/onepage-personal")
SITE = os.path.expanduser("~/workspace/mounir-web")
ASSETS = os.path.join(SITE, "studio-nojom")
WA = "212667682868"

os.makedirs(ASSETS, exist_ok=True)
# ---- copy static assets as-is ----
for d in ["css", "js", "fonts"]:
    dst = os.path.join(ASSETS, d)
    if os.path.exists(dst):
        shutil.rmtree(dst)
    shutil.copytree(os.path.join(SRC, d), dst)

# ---- copy + compress only the referenced images ----
KEEP = [
    "slider/6.jpg", "slider/4.jpg",
    "services/1.jpg", "services/2.jpg", "services/3.jpg",
    "services/4.jpg", "services/5.jpg", "services/6.jpg",
    "gallery/01.jpg", "gallery/02.jpg", "gallery/03.jpg", "gallery/04.jpg",
    "gallery/05.jpg", "gallery/06.jpg", "gallery/07.jpg", "gallery/08.jpg",
    "gallery/09.jpg",
    "team/1.jpg", "team/2.jpg", "team/3.jpg",
    "team/5.jpeg", "team/6.jpeg", "team/7.jpeg",
    "price/1.jpg", "price/2.jpg", "price/3.jpg",
    "quot.png", "favicon.png",
]
for rel in KEEP:
    s = os.path.join(SRC, "img", rel)
    d = os.path.join(ASSETS, "img", rel)
    os.makedirs(os.path.dirname(d), exist_ok=True)
    if rel.endswith(".png"):
        shutil.copy(s, d)
    else:
        im = Image.open(s).convert("RGB")
        im.thumbnail((1200, 1200))
        im.save(d, "JPEG", quality=78)
for root, _, files in os.walk(ASSETS):
    for f in files:
        if f == ".DS_Store":
            os.remove(os.path.join(root, f))

# ---- transform the HTML ----
html = open(os.path.join(SRC, "index.html"), encoding="utf-8").read()

def rep(old, new, cnt=1):
    global html
    assert old in html, f"NOT FOUND: {old[:70]}"
    html = html.replace(old, new, cnt)

# head
rep('<html lang="en">', '<html lang="fr">')
rep("<title>DAN - Creative Photography Portfolio & Photo Studio Template</title>",
    "<title>Studio Nojom — Studio de photographie à Tanger | Mariages, Portraits, Événements</title>")
rep('<meta name="description" content="DAN is a premium photography portfolio template for wedding, fashion, and model photographers. Showcase your visual stories with a clean, responsive, and modern gallery.">',
    '<meta name="description" content="Studio Nojom, studio de photographie à Tanger : mariages, portraits, événements et photographie de marque. Réservez votre séance sur WhatsApp.">')
rep('<meta name="robots" content="index, follow">', '<meta name="robots" content="noindex, nofollow">')
rep('    <link rel="canonical" href="https://duruthemes.com/demo/html/dan/onepage-personal/">\n', '')
rep('<meta name="author" content="DuruThemes">', '<meta name="author" content="Studio Nojom">')

# asset prefixes
html = html.replace('href="css/', 'href="studio-nojom/css/')
html = html.replace('src="js/', 'src="studio-nojom/js/')
html = html.replace('src="img/', 'src="studio-nojom/img/')
html = html.replace('href="img/', 'href="studio-nojom/img/')
html = html.replace('data-background="img/', 'data-background="studio-nojom/img/')
html = html.replace('url(img/', 'url(studio-nojom/img/')

# logos -> text logos
rep('<a class="logo" href="index.html"> <img src="studio-nojom/img/logo-light.png" class="logo-img" alt=""> </a>',
    '<a class="logo" href="#"> <span class="nojom-logo">STUDIO <b>NOJOM</b></span> </a>')
rep('<div class="brand"> <img src="studio-nojom/img/logo-dark.png" class="logo" alt="">',
    '<div class="brand"> <span class="nojom-logo dark">STUDIO <b>NOJOM</b></span>')

# nav: drop the dropdown block, translate labels
m = re.search(r'<li class="nav-item dropdown">.*?</li>\s*(?=<li class="nav-item"><a class="nav-link" href="#" data-scroll-nav="5">)', html, re.S)
assert m, "dropdown block not found"
html = html.replace(m.group(0), '', 1)
for en, fr in [(">Home<", ">Accueil<"), (">About<", ">Le Studio<"), (">Services<", ">Services<"),
               (">Portfolio<", ">Portfolio<"), (">Testimonials<", ">Avis<"), (">Team<", ">Équipe<"),
               (">Pricing<", ">Tarifs<"), (">Blog<", ">Journal<"), (">Contact<", ">Contact<")]:
    rep(en, fr)

# hero
rep("ESTD 2012", "TANGER · MAROC")
rep('<h1 class="animate-box" data-animate-effect="fadeInUp">Dan Halsman</h1>',
    '<h1 class="animate-box" data-animate-effect="fadeInUp">Studio Nojom</h1>')
rep('<h5 class="animate-box" data-animate-effect="fadeInUp">Photographer</h5>',
    '<h5 class="animate-box" data-animate-effect="fadeInUp">Mariages · Portraits · Événements</h5>')

# about
rep("<span>About Us</span>", "<span>Le Studio</span>")
rep("<h2>Dan Halsman</h2>", "<h2>Studio Nojom</h2>")
rep("<p>Quisque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam et odio sedan arami accumsan gravida. Mauris in rhoncus mauris. Duis a massa ac ex malesuada aliquet. Mauris odio in devam company the design dolor leo facilisis ligula eget malesuada metus ununc posuere velsem.</p>",
    "<p>Studio Nojom est un studio de photographie basé à Tanger, dédié aux moments qui comptent : mariages, portraits, événements et images de marque. Notre signature : une lumière maîtrisée, des émotions vraies et un rendu éditorial intemporel.</p>")
rep('<p class="mb-30">Aliquam erat volutpat. Curabitur tortor mauris, iaculis vel pulvinar at, convallis id mauris. Praesent feugiat dui sit amet ullamcorper blandit ligula ligula volutpat ante sed rhoncus nunc ante non ex. Donec porta elementum estid suscipit nisl bibendum vitae. Sedet nisi lacinia the adam drana diam.</p>',
    '<p class="mb-30">Du premier rendez-vous à la livraison de votre galerie privée en ligne, nous vous accompagnons à chaque étape : conseils avant la séance, direction douce pendant les prises de vue et retouche soignée de chaque image sélectionnée.</p>')
# drop the fake awards carousel entirely
m = re.search(r'<div class="row awards">.*?</div>\s*</div>\s*</div>\s*</section>', html, re.S)
assert m, "awards block not found"
html = html.replace(m.group(0), '</div>\n        </div>\n    </section>', 1)

# services
rep("<span>What We Do</span>", "<span>Nos Services</span>")
rep("<h2>Our Services</h2>", "<h2>Services</h2>")
for a, b in [("Portrait Photography", "Photographie de Portrait"),
             ("Wedding Photography", "Photographie de Mariage"),
             ("Travel Photography", "Événements & Reportages"),
             ("Still Life Photography", "Produits & Marques"),
             ("Fashion Photography", "Mode & Éditorial"),
             ("Sport Photography", "Famille & Enfants")]:
    html = html.replace(a, b)
html = html.replace(">Discover<", ">Découvrir<")
html = re.sub(r'href="(potrait|wedding|travel|still-life|fashion|sporty)-photography\.html"', 'href="#portfolio"', html)
rep('<a class="underline-text" href="services.html">All Services</a>',
    '<a class="underline-text" href="#pricing">Voir les tarifs</a>')

# gallery titles
for a, b in [("Model Photography", "Mode"), ("Wedding Photography", "Mariage"),
             ("Portrait Photography", "Portrait"), ("Travel Photography", "Événement"),
             ("Family Photography", "Famille"), ("Sport Photography", "Reportage"),
             ("Product Photography", "Produit"), ("Still Life Photography", "Éditorial")]:
    html = html.replace(f'title="{a}"', f'title="{b}"')
rep("<span>Gallery</span>", "<span>Galerie</span>")

# testimonials
QUOTE = '"Dan tristique usto duision vitae diamen neque nivamus aesta atene artines arinianu ateli finibus viverra nec lacus. Nedana dinoz setlie suscipe none misster cuvvan tristique. Developer inila duman aten elit finibus viveracus themone the dru."'
quotes = [
    "« Une équipe discrète et très professionnelle. Les photos de notre mariage à Tanger sont magnifiques — naturelles et lumineuses, exactement ce que nous espérions. »",
    "« Séance portrait pour mon entreprise : rapide, efficace, et un résultat que j'utilise partout. Je recommande vivement. »",
    "« Ils ont su mettre nos enfants à l'aise en quelques minutes. Les photos de famille sont superbes. »",
    "« Ils ont su mettre nos enfants à l'aise en quelques minutes. Les photos de famille sont superbes. »",
]
for q in quotes:
    rep(QUOTE, q)
for a, b in [("Olivia & Enrico", "Salma & Youssef"), ("Fredia & Pabloe", "Adam B."),
             ("Eleanor & Stefano", "Famille El Amrani")]:
    html = html.replace(a, b)
html = html.replace("Wedding Shooting", "Mariage à Tanger", 1)
html = html.replace("Wedding Shooting", "Portrait corporate", 1)
html = html.replace("Wedding Shooting", "Séance famille", 1)
html = html.replace("Wedding Shooting", "Séance famille", 1)

# team
rep("<span>Photographer</span>", "<span>L'équipe</span>")
rep("<h2>Awesome Team</h2>", "<h2>Nos photographes</h2>")
for a, b in [("Kristin Bowles", "Yasmine El Fassi"), ("Wedding Photographer", "Photographe mariages"),
             ("kristin@danphoto.com", "Studio Nojom — Tanger"),
             ("Nelsan Compton", "Omar Benali"), ("Model Photographer", "Portraits & éditorial"),
             ("nelsan@danphoto.com", "Studio Nojom — Tanger"),
             ("Micheal Preston", "Salma Idrissi"), ("Event Photographer", "Retouche & production"),
             ("micheal@danphoto.com", "Studio Nojom — Tanger")]:
    rep(a, b)
html = re.sub(r'href="team-details\d*\.html"', 'href="#team"', html)

# pricing
rep("<span>Shooting</span>", "<span>Formules</span>")
rep("<h2>Pricing Tables</h2>", "<h2>Nos tarifs</h2>")
packs = [
    ("Standart", "Essentiel", "300", "499", WA,
     "Bonjour Studio Nojom, je veux réserver le pack Essentiel (499 DH).",
     ["3 Hours Session", "Photo Editing", "50 Digital Images", "Online Gallery"],
     ["Séance d'1 heure", "Retouche professionnelle", "30 photos numériques", "Galerie en ligne"]),
    ("Premium", "Signature", "450", "1 490", WA,
     "Bonjour Studio Nojom, je veux réserver le pack Signature (1 490 DH).",
     ["6 Hours Session", "Photo Editing", "100 Digital Images", "Online Gallery"],
     ["Séance de 3 heures", "Retouche premium", "80 photos numériques", "Galerie en ligne + mini album"]),
    ("Platinum", "Mariage", "750", "4 900", WA,
     "Bonjour Studio Nojom, je veux des informations sur le pack Mariage (4 900 DH).",
     ["12 Hours Session", "Photo Editing", "250 Digital Images", "Online Gallery"],
     ["Couverture complète (12 h)", "Deux photographes", "300+ photos retouchées", "Galerie privée en ligne"]),
]
from urllib.parse import quote
for old_t, new_t, old_p, new_p, wa, msg, old_f, new_f in packs:
    rep(f'<h3 class="pricing-pt-title">{old_t}</h3>', f'<h3 class="pricing-pt-title">{new_t}</h3>')
    rep(f'<span class="pricing-price" style="color: #ffffff">{old_p}</span>',
        f'<span class="pricing-price" style="color: #ffffff">{new_p} <small style="font-size:45%">DH</small></span>')
    for o, n in zip(old_f, new_f):
        rep(f"<li>{o}</li>", f"<li>{n}</li>")
    link = f"https://wa.me/{wa}?text={quote(msg)}"
    anchor = f'<div class="price-box">'
    # add a booking button right after each price box closes is complex; instead inject before the box end via the title marker
    html = html.replace(f'<h3 class="pricing-pt-title">{new_t}</h3>',
                        f'<h3 class="pricing-pt-title">{new_t}</h3>', 1)
rep('<sup class="pricing-dolar">$</sup> ', '')
html = html.replace('<sup class="pricing-dolar">$</sup>', '')
# booking buttons: append after each pricing-content list
html = re.sub(r'(<li class="pricing-content">\s*<ul>.*?</ul>\s*</li>)',
              r'\1\n                                <li style="margin-top:14px"><a class="btn flat-btn float-btn" style="display:inline-block;padding:10px 22px" target="_blank" rel="noopener" href="https://wa.me/' + WA + '">Réserver sur WhatsApp</a></li>',
              html, flags=re.S)

# blog
rep("<span>Read</span>", "<span>Journal</span>")
rep("<h2>Latest News</h2>", "<h2>Derniers articles</h2>")
for a, b in [("Black & White Shots", "L'art du noir & blanc"),
             ("Lovely Wedding", "Un mariage à Tanger"),
             ("Product Shots", "Photographier vos produits")]:
    html = html.replace(a, b)
excerpts = [
    "Pourquoi les images en noir et blanc traversent le temps — et quand les choisir pour votre séance.",
    "Lumière de la médina, vent de la corniche : nos lieux préférés pour un reportage de mariage à Tanger.",
    "Fond, lumière, cadrage : les trois réglages qui changent tout pour vos photos e-commerce.",
]
OLD_EX = "Quisque luctus tincidunt enim dapibusen pharetra neue ultricies at. Morbi dapibus mauris id selerisque placerat nula massa lacinia orci in facilisis nulla."
for e in excerpts:
    rep(OLD_EX, e)
for d, nd in [("26 December 2026", "12 novembre 2026"), ("18 December 2026", "28 novembre 2026"),
              ("20 December 2026", "5 décembre 2026")]:
    rep(d, nd)
html = html.replace("0 Comments", "Studio Nojom")
html = re.sub(r'href="(blog|black-white-shots|lovely-wedding|product-shots)\.html"', 'href="#blog"', html)
html = html.replace(">Read More<", ">Lire la suite<")

# contact
rep("<span>Location</span>", "<span>Tanger, Maroc</span>")
rep('<h2 class="">Contact Us</h2>', '<h2 class="">Contactez-nous</h2>')
rep("<p>I'd love to hear from you! Please fill out the form below or send a note directly with as much details as possible to info@danhalsman.com</p>",
    "<p>Un projet, une date, une envie d'images ? Écrivez-nous : réponse rapide sur WhatsApp, ou via le formulaire — il ouvre directement WhatsApp avec votre message.</p>")
rep("<p><b>Phone</b> : +1 650-444-0000</p>", "<p><b>Téléphone / WhatsApp</b> : +212 667-682 868</p>")
rep("<p><b>Address</b> : 525 West Ave, CT 06850 Norwalk</p>", "<p><b>Adresse</b> : Tanger, Maroc</p>")
rep("<p><b>Email</b> : info@danhalsman.com</p>", "<p><b>Horaires</b> : Lun – Sam, 10h00 – 19h00</p>")
rep('<a href="https://www.google.com/maps" target="_blank">Get Directions</a>',
    '<a href="https://www.google.com/maps/search/?api=1&query=Tanger" target="_blank">Itinéraire</a>')
rep("<p><b>Get in touch</b></p>", "<p><b>Écrivez-nous</b></p>")
rep('placeholder="Your Name *"', 'placeholder="Votre nom *"')
rep('placeholder="Your Email"', 'placeholder="Votre téléphone"')
rep('placeholder="Your Message"', 'placeholder="Votre message (type de séance, date souhaitée…)"')
rep('<form method="post" class="row">', '<form class="row" id="nojomForm">')
rep('<button class="btn float-btn flat-btn" type="submit">Submit</button>',
    '<button class="btn float-btn flat-btn" type="submit">Envoyer via WhatsApp</button>')

# footer
rep("<p>Dan Photography Agency habitant morbi tristique senectus et netus et malesuada fames shootin the lacinia the adama sor drana diam.</p>",
    "<p>Studio de photographie à Tanger — mariages, portraits, événements et photographie de marque.</p>")
rep("""<p><b>Get in touch</b>E: info@danhalsman.com
                        <br> P: +1 650-444-0000
                        <br> A: 525 West Ave, CT 06850 — Norwalk
                    </p>""",
    """<p><b>Contact</b>
                        <br> Tél / WhatsApp : +212 667-682 868
                        <br> Adresse : Tanger, Maroc
                    </p>""")
rep("<p>You can follow us on our social media accounts for up-to-date photos.</p>",
    "<p>Suivez-nous pour découvrir nos derniers reportages et les coulisses du studio.</p>")
rep("<p>©2026 All rights reserved. Designed by DuruThemes.</p>",
    "<p>© 2026 Studio Nojom — Tanger. Tous droits réservés. · Site de démonstration : photos, avis et tarifs indicatifs.</p>")
rep('<p><a href="#">Terms of use</a> <span>|</span> <a href="#">Privacy Policy</a></p>',
    '<p><a href="#contact">Réserver une séance</a></p>')

# extras: logo style + form->WhatsApp + floating WA button + demo badge
extra_css = """
<style>
.nojom-logo{font-family:'Barlow Condensed',sans-serif;font-size:30px;font-weight:500;letter-spacing:3px;color:#fff;text-transform:uppercase}
.nojom-logo b{font-weight:700;color:#d6a94f}
.nojom-logo.dark{color:#141414}
.demo-badge{position:fixed;left:14px;bottom:14px;z-index:999;background:rgba(10,10,10,.82);color:#f2c66d;border:1px solid rgba(214,169,79,.5);font-size:12px;font-weight:600;padding:7px 14px;border-radius:50px;backdrop-filter:blur(4px)}
.wa-float2{position:fixed;left:14px;bottom:56px;z-index:999;width:52px;height:52px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;font-size:26px;text-decoration:none;box-shadow:0 8px 22px rgba(0,0,0,.35)}
</style>
</head>"""
rep("</head>", extra_css)
extra_body = """
<div class="demo-badge">Site de démonstration — photos et tarifs indicatifs</div>
<a class="wa-float2" href="https://wa.me/""" + WA + """?text=Bonjour%20Studio%20Nojom%2C%20je%20veux%20des%20informations%20sur%20vos%20s%C3%A9ances%20photo." target="_blank" rel="noopener" aria-label="WhatsApp">💬</a>
<script>
document.getElementById('nojomForm').addEventListener('submit', function(e){
  e.preventDefault();
  var inputs = this.querySelectorAll('input, textarea');
  var name = inputs[0].value || '';
  var msg = this.querySelector('textarea').value || '';
  var text = 'Bonjour Studio Nojom, je suis ' + name + '. ' + msg;
  window.open('https://wa.me/""" + WA + """?text=' + encodeURIComponent(text), '_blank');
});
</script>
</body>"""
rep("</body>", extra_body)

out = os.path.join(SITE, "nojom-demo.html")
open(out, "w", encoding="utf-8").write(html)
total = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(ASSETS) for f in fs)
print("written:", out, len(html), "bytes | assets total:", round(total / 1e6, 2), "MB")
