# Mediendidaktik

## Todo

- [ ] change jwt secret
- [ ] jwk secret in .env?
- [ ] Was passiert, wenn der JWT abläuft?

## Next Steps

- Im Frontend JWT auslesen und Anfrage an Backend senden

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