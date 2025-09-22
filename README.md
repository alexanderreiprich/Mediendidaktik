# Mediendidaktik

## Todo

- [ ] change jwt secret
- [ ] jwk secret in .env?
- [ ] Was passiert, wenn der JWT abläuft?
- [ ] Remove Cors
- [ ] Wenn man die App nicht über OPAL und damit LTI aufruft kann man trotzdem nutzen, aber beim speichern und laden gibts unauthorised
- [ ] Assets calls nicht über absolute Route sondern irgendwie relativ machen, sodass nicht hci domain in den Musterlösungen drin steht
- [ ] Alle hci Domains durch env ersetzen und in docker-compose.yml

## Next Steps

- Im Frontend gegf. JWT auslesen und Anfrage an Backend senden

## Routes Backen

- `https://hci-lti-lernapp.imn.htwk-leipzig.de/backend`
  - `/api/task/:id`
    - GET
      - Wenn keine eigene Lösung existiert wird 204 No Content zurückgegeben
      - Ansonsten wird eigene Lösung zurückgegeben
    - POST
      - ```json
        {
          "html": "HTML",
          "css": "CSS",
          "js": "JS"
        }
        ```
  - `/api/task/:id/begin`
    - GET
      - Gibt allgemein :id Aufgabenstart-HTML zurück

## Zum localen Testen in Docker

1. Docker installieren
2. Repo Clonen
3. Im Root des Projektes `docker compose up`
4. Frontend über http://localhost:3001/ aufrufen

Wenn Änderungen gemacht wurden:
1. `docker compose down` 
2. `docker compose build`
3. `docker compose up`

Beim lokalen Setup sind die Routen ohne /backend!:

- `http://localhost:3000`
  - `/api/task/:id`
  - `/api/task/:id/begin`

Außerdem bitte `credentials: "include"` beim fetchen, damit Cookies genutzt werden. Sagt ChatGTP.