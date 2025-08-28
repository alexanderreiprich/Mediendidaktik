# Mediendidaktik

## Todo

- [ ] change jwt secret
- [ ] jwk secret in .env?
- [ ] Was passiert, wenn der JWT abläuft?
- [ ] Remove Cors
- [ ] Aufgabe Laden Button nicht mehr sinnvoll?
- [ ] Router fixen, dass Browser Back ordentlich geht
- [ ] Live Preview fixen. Wird manchmal nicht geladen

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
        {"content":"CONTENT"}
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