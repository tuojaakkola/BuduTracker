# Oppimispäiväkirja

4.11

- Projektin alustus
- Kansionrakenteen muuttaminen
- Projektia suunnittellessa mieleen tuli vaihtoehto, että käyttäjä voisi saada tulot sekä menot suoraan pankista ilman niin ettei niitä tarvitsisi täyttää itse. Selvittelyn jälkeen selvisi että pankkidatan hakeminen on tiukasti säädeltyä PSD2-direktiivillä, joka vaatii virallisen lisenssin jotta dataa voi hakea. Suomessa tämän lisenssin voi hakea vain yritykset hakemalla sitä Finassivalvonnalta, jonka päädyin ratkaisuun että käyttäjä syöttää itse tulot ja menot. On myös olemassa välipalveluita kuten Tink tai Nordigen joiden avulla dataa voisi saada kirjautumalla omaan pankkiin palvelun kautta. Tämä vaatisi kuitenkin backendin tekoa tokeneille ja tilidatalle ja tässä projektissa haluan keskittyä enemmän itse ReactNativen käyttöön.

---

5.11

- Yksinkertaisen tab navigaation tekeminen Expo-Routerilla. Tuttu tehtävä viikkotehtävästä, mutta dokumentaatioon tutustuminen antoi lisätietoa erilaisista navigaatio tyypeistä mitä Expo Router tarjoaa. Uusi mielenkiintoinen asia oli Native Tabs joiden avulla voi käyttää natiiveita tab painikkeita. Tämä ominaisuus ei ilmesti harmillisesti toimi web versiossa, jota olen käyttänyt kehitykseen. Aion kuitenkin käyttää niitä, koska ne näyttävät paremmalta kuin javascriptin omat.

---

6.11
Päätin tehdä projektiin backendin Noden Express frameworkilla. Tämä on itselleni kokonaan uutta. Olin aloittamassa backendin rakentamista NextJS avulla, koska olen kuullut paljon mainintoja siitä. Selvittelyn jälkeen kuitenkin ymmärsin että se on hyvä framework web fullstack projektille, mutta Expo + React Nativen kanssa se ei integroidu luontevasti. NextJS on siis ensisijaisesti web-puolelle ja Express sopii paremmin mobiiliprojektin backendiksi, koska sillä on helppoa rakentaa yksinkertainen API-palvelin.

---

7.11
Tein backend kansion ja aloin tutustumaan Expressiin sekä prismaan jota hyödynnän tietokantaan yhdistämisessä. Loin ensimmäiset yksinkertaiset taulut "Expense" ja "Income" prisman luomaan schema tiedostoon. Loin myös routes kansion, joka vastaa taulujen controllereista. Testasin endpointteja testidatalla, jonka loin prisma seed:iä hyödyntäen.

---

10.11
