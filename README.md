# Proiect Single Page App (SPA) cu Operații CRUD

## Descriere proiect

Proiectul constă în dezvoltarea unei aplicații web Single Page App (SPA) pentru a exemplifica operațiile CRUD (Create, Read, Update, Delete) pentru două tipuri de obiecte relaționate. Opțiunile pentru relații includ 1 la 1, 1 la mulți sau mulți la mulți. De exemplu, puteți alege să lucrați cu obiecte precum "produse" și "categorii", sau "studenti" și "sporturi practicate".

## Cerințe tehnice

### Baza de date

- Utilizați serviciul Firebase Firestore pentru stocarea datelor.
- Înregistrările din baza de date trebuie să fie generate aleator folosind o soluție precum Faker, ChanceJS, Falso sau similar.

### Front-end

- Dezvoltați partea de front-end a aplicației folosind framework-ul VueJS (Vue 3).
- Numărul de componente nu este limitat.
- Operațiile care necesită acces la date din baza de date pot fi realizate direct din interfața Vue.

### Back-end

- Creați un API RESTful utilizând NodeJS cu Express.
- Autentificarea utilizatorilor este necesară pentru orice operație care alterează datele din baza de date, utilizând token-uri, sesiuni sau autentificarea Firebase.

### Operații API

- Operațiile GET ale API-ului trebuie să returneze date în format JSON și să nu necesite autentificare.

## Punctaj și criterii de evaluare

Punctajul maxim pentru proiect este de 50 de puncte, dintr-un total de 100 de puncte pentru nota finală. Pentru a promova, studenții trebuie să obțină cel puțin 25 de puncte pentru proiect și cel puțin 25 de puncte pentru testul grilă.

### Reduceri de punctaj

- Interfața neresponsivă pe cel puțin 3 praguri (de exemplu, mobile, tabletă, desktop) - (-5 puncte).
- Layout-ul neîngrijit - (-10 puncte).
- Lipsa autentificării pentru operațiile care alterează baza de date - (-10 puncte).
- Lipsa datelor generate în prealabil (Faker, ChanceJS, Falso sau similar) - (-5 puncte).
- Lipsa unei minime validări a datelor înainte de a fi scrise în baza de date - (-5 puncte).
- Lipsa unei arhitecturi corespunzătoare între front-end și RESTful API - (-25 puncte).
- Lipsa utilizării corespunzătoare a codurilor de răspuns HTTP - (-5 puncte).
- Neutilizarea Firebase - (-25 puncte).
- Utilizarea bazei de date într-un mod preponderant tipic SQL - (-10 puncte).
- Neutilizarea Vue 3 - (-25 puncte).
- Lipsa utilizării unui sistem de management al stării (Vuex) - (-5 puncte).

### Puncte bonus

- Implementarea unei liste de elemente cu cel puțin 2 opțiuni de sortare (de exemplu, ASC/DESC după preț, ordine alfabetică după nume) - (+5 puncte).
- Implementarea unei funcționalități de paginare - (+5 puncte).
- Deploy-ul proiectului pe un subdomeniu sau domeniu propriu - (+5 puncte).
- Implementarea funcționalității de încărcare de fișiere - (+5 puncte).
- Implementarea unei funcționalități de acces în timp real la baza de date - (+5 puncte).
