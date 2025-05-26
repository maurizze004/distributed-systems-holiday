# Projektdokumentation: Verteiltes System "Mein Urlaub"

## Inhaltsverzeichnis

1. [Einleitung](#1-einleitung)
2. [Zielsetzung](#2-zielsetzung)
3. [Systemarchitektur](#3-systemarchitektur)
4. [Komponentenbeschreibung](#4-komponentenbeschreibung)

   * [Hotel-Service](#hotel-service)
   * [Flug-Service](#flug-service)
   * [Mietwagen-Service](#mietwagen-service)
   * [Buchungs-Service](#buchungs-service)
   * [Admin-Frontend](#admin-frontend)
   * [User-Frontend](#user-frontend)
5. [API-Dokumentation](#5-api-dokumentation)
6. [Technologie-Stack](#6-technologie-stack)
7. [Vorgehensweise bei der Umsetzung](#7-vorgehensweise-bei-der-umsetzung)
8. [Benutzerdokumentation](#8-benutzerdokumentation)
9. [Hosting-Vorschlag](#9-hosting-vorschlag)
10. [Fazit](#10-fazit)
11. [Ausblick](#11-ausblick)

---

## 1. Einleitung

Diese Dokumentation beschreibt die Konzeption, Umsetzung und Nutzung des Projekts "Mein Urlaub", das im Rahmen der Vorlesung "Verteilte Systeme" an der DHBW Heilbronn realisiert wurde. Das System basiert auf einer Microservice-Architektur und ermöglicht es Benutzern, Urlaubsangebote wie Hotels, Flüge und Mietwagen zu durchsuchen. Eine Buchungsfunktion ist konzeptionell angelegt, aber aktuell nicht vollständig implementiert.

## 2. Zielsetzung

Ziel des Projekts ist die Entwicklung eines verteilten, webbasierten Systems, welches Urlaubsangebote über eine modulare Architektur bereitstellt. Dabei sollen die folgenden Anforderungen erfüllt werden:

* Trennung in unabhängige Microservices
* Nutzung von ExpressJS und MongoDB
* Zwei Frontends (Admin: CRUD, User: Read-only)
* Keine Authentifizierung
* Vollständige Dokumentation

## 3. Systemarchitektur

Das System besteht aus mehreren unabhängig deploybaren Komponenten:

### Architekturdiagramm 

```
                  +-------------------+
                  |   Admin-Frontend  |
                  +-------------------+
                           |
                           v
                  +-------------------+
                  |   User-Frontend   |
                  +-------------------+
                           |
                           v
     +------------+   +------------+   +------------+
     | Hotel-Svc  |   | Flug-Svc   |   | Auto-Svc   |
     +------------+   +------------+   +------------+
           |                |                |
     +------------+   +------------+   +------------+
     | MongoDB    |   | MongoDB    |   | MongoDB    |
     +------------+   +------------+   +------------+
```

## 4. Komponentenbeschreibung

### Hotel-Service

* REST API zur Verwaltung von Hotels
* Funktionen: `GET`, `POST`, `PUT`, `DELETE`
* **Datenmodell:** Name, Ort, Sterne, Preis pro Nacht, Verfügbarkeit

### Flug-Service

* REST API zur Verwaltung von Flügen
* Funktionen: `GET`, `POST`, `PUT`, `DELETE`
* **Datenmodell:** Abflugort, Zielort, Flugnummer, Datum, Preis

### Mietwagen-Service

* REST API zur Verwaltung von Mietwagen
* Funktionen: `GET`, `POST`, `PUT`, `DELETE`
* **Datenmodell:** Marke, Modell, Standort, Preis pro Tag

### Buchungs-Service

* Struktur und API vorbereitet, jedoch aktuell **nicht vollständig implementiert**

### Admin-Frontend

* Implementiert mit React und Bootstrap
* Ermöglicht vollständiges Management der Angebote (CRUD)
* Kommuniziert direkt mit den REST-APIs der Microservices

### User-Frontend

* Implementiert mit React
* Bietet ausschließlich lesenden Zugriff auf Angebote
* Ermöglicht das Durchsuchen und Anzeigen von Reisedaten

## 5. API-Dokumentation

* Die APIs der Services sind dokumentiert via Swagger UI
* Swagger-Aggregator bündelt alle OpenAPI-Spezifikationen in einer zentralen Oberfläche

### Beispiel-Endpunkte

```http
GET /hotels        // Liste aller Hotels
POST /cars         // Neues Auto hinzufügen
GET /flights/:id   // Flugdetails anzeigen
```

## 6. Technologie-Stack

* **Backend:** Node.js, Express.js
* **Frontend:** React, Bootstrap
* **Datenbanken:** MongoDB (jeweils pro Microservice)
* **API-Dokumentation:** Swagger UI
* **Weitere Tools:** Postman (für Tests)

## 7. Vorgehensweise bei der Umsetzung

1. Planung der Systemarchitektur
2. Erstellung der Datenmodelle
3. Entwicklung der RESTful APIs pro Service
4. Implementierung der Admin- und User-Frontends
5. Testing mit Postman und Swagger UI
6. Erstellung dieser Dokumentation

## 8. Benutzerdokumentation

### Admin-Zugang

* **URL:** `/admin`
* **Funktionen:**

  * Hotels verwalten
  * Flüge verwalten
  * Mietwagen verwalten

### User-Zugang

* **URL:** `/`
* **Funktionen:**

  * Angebote durchsuchen
  * Details zu Hotels, Flügen und Mietwagen anzeigen

## 9. Hosting-Vorschlag

### Plattformempfehlung

* Render.com oder Railway.app

### Beispielhafte Kosten 

| Komponente       | Typ         | Kosten pro Monat |
| ---------------- | ----------- | ---------------- |
| 3 Microservices  | Web Service | je 7 €         |
| MongoDB Atlas    | DB Cluster  | ab 0 €         |
| Frontend (Admin) | Web Service | 7 €            |
| Frontend (User)  | Web Service | 7 €            |
| **Gesamt**       |             | **35–50 €**    |

## 10. Fazit

Das Projekt "Mein Urlaub" erfüllt die gestellten Anforderungen vollständig. Die Services funktionieren unabhängig, die Frontends sind klar getrennt nach Benutzerrollen, und CRUD-Funktionalitäten sind implementiert. Die Authentifizierung wurde bewusst nicht umgesetzt, wie vorgesehen. Eine Buchungslogik ist vorbereitet, aber noch nicht einsatzbereit.

## 11. Ausblick

Für die Weiterentwicklung des Projekts bieten sich folgende Maßnahmen an:

* Implementierung des Buchungs-Services mit Transaktionslogik
* Einführung einer Authentifizierung mit rollenbasiertem Zugriff
* Verbesserung der Fehlertoleranz durch Retry-Mechanismen oder Service-Kommunikation mit Circuit Breaker
* Optionales Deployment auf einer PaaS-Plattform (Render, Railway, etc.)
* Bereitstellung realistischer Seed-Daten zur Testunterstützung

---

*Erstellt im Rahmen der Veranstaltung "Verteilte Systeme" an der DHBW Heilbronn, SoSe 2023 – Dozent: Marc Metzger* <br>
*Projekt: https://github.com/maurizze004/distributed-systems-holiday*
