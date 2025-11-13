# Oppimispäiväkirja

4.11

- Projektin alustus
- Kansionrakenteen muuttaminen
- Projektia suunnittellessa mieleen tuli vaihtoehto, että käyttäjä voisi saada tulot sekä menot suoraan pankista ilman niin ettei niitä tarvitsisi täyttää itse. Selvittelyn jälkeen selvisi että pankkidatan hakeminen on tiukasti säädeltyä PSD2-direktiivillä, joka vaatii virallisen lisenssin jotta dataa voi hakea. Suomessa tämän lisenssin voi hakea vain yritykset hakemalla sitä Finassivalvonnalta, jonka päädyin ratkaisuun että käyttäjä syöttää itse tulot ja menot. On myös olemassa välipalveluita kuten Tink tai Nordigen joiden avulla dataa voisi saada kirjautumalla omaan pankkiin palvelun kautta. Tämä vaatisi kuitenkin backendin tekoa tokeneille ja tilidatalle ja tässä projektissa haluan keskittyä enemmän itse ReactNativen käyttöön.

---

5.11
Yksinkertaisen tab navigaation tekeminen Expo-Routerilla. Tuttu tehtävä viikkotehtävästä, mutta dokumentaatioon tutustuminen antoi lisätietoa erilaisista navigaatio tyypeistä mitä Expo Router tarjoaa. Uusi mielenkiintoinen asia oli Native Tabs joiden avulla voi käyttää natiiveita tab painikkeita. Tämä ominaisuus ei ilmesti harmillisesti toimi web versiossa, jota olen käyttänyt kehitykseen. Aion kuitenkin käyttää niitä, koska ne näyttävät paremmalta kuin javascriptin omat.

---

6.11
Päätin tehdä projektiin backendin Noden Express frameworkilla. Tämä on itselleni kokonaan uutta. Olin aloittamassa backendin rakentamista NextJS avulla, koska olen kuullut paljon mainintoja siitä. Selvittelyn jälkeen kuitenkin ymmärsin että se on hyvä framework web fullstack projektille, mutta Expo + React Nativen kanssa se ei integroidu luontevasti. NextJS on siis ensisijaisesti web-puolelle ja Express sopii paremmin mobiiliprojektin backendiksi, koska sillä on helppoa rakentaa yksinkertainen API-palvelin.

---

7.11
Tein backend kansion ja aloin tutustumaan Expressiin sekä prismaan jota hyödynnän tietokantaan yhdistämisessä. Loin ensimmäiset yksinkertaiset taulut "Expense" ja "Income" prisman luomaan schema tiedostoon. Loin myös routes kansion, joka vastaa taulujen controllereista. Testasin endpointteja testidatalla, jonka loin prisma seed:iä hyödyntäen. Express ympäristössä controllereita kutsutaan routes, joka oli aluksi hämäävää.

---

10.11
Aloin luomaan home pagen ulkoasua ja loin ensimmäisen komponentin SummaryCard, joka näyttää tulojen/menojen summan palkissas sekä rahatilanteen. Komponentti fetchaa datan backendin testidatasta. Tein myös api.ts tiedostoon yksinkertaiset crud http pyynnöt menoille ja tuloille.

---

11.11
Ymmärsin että erilaisten visuaalisten graafien tekeminen tuloista tai menoista kategorioita hyödyntäen ei ole helppoa jos sovelluksessani ei ole valmiita kategorioita, joita käyttäjä voi rahaliikenteen lisäämisen yhteydessä syöttää. Backendiin lisättiin uusi taulu kategorialle. Expense ja Income taulu muokataan hyödyntämään tätä kategoria taulua.

---

12.11
Modal komponentti tulojen/menojen lisäämiselle. Opin modalin rakanteista ja erilaisista tavoista miten sitä voi näyttää esim. animationtype: "slide". Sain myös lisää kokemusta formiin syötetyn datan validointiin. Kokeilin myös avata appiani expo sovelluksessa webin sijaan jolloin sain kasan virheilmoituksia. Selvittelyn jälkeen tajusin, että olen kotini netissä ja jossa puhelin ei ole yhdistettynä. Tästä selvittelystä opin etsimään ip osoitteen ipconfig komennolla sekä ymmärsin paremmin miksi tunnel yhteystilaa saatetaan käyttää tälläisissä tilanteissa.

---

13.11
Home sivulle lisättiin FlatList, joka näyttää viimeisimmät tapahtumat. Tapahtuma itemien näyttämiseen luotiin TransactionItem komponentti, joka näyttää tapahtumat tärkeimmät tiedot. Opin lisää Flatlistin erilaisista ominaisuuksista kuten miten ladata lisää listan itemeitä jo ennenkuin lista loppuu(onEndReachedThreshhold).
