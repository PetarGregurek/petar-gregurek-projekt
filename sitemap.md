# Semantički model usmjeravanja (Sitemap)

Dokument prikazuje dostupne URL-ove, mapiranje na controller i akcije, te view koji se renderira.

## Ruta i view mapiranje

| URL | Controller | Akcija | View |
|---|---|---|---|
| `/` | HomeController | Index | `Views/Home/Index.cshtml` |
| `/Home/Index` | HomeController | Index | `Views/Home/Index.cshtml` |
| `/privacy` | HomeController | Privacy | `Views/Home/Privacy.cshtml` |
| `/Home/Privacy` | HomeController | Privacy | `Views/Home/Privacy.cshtml` |
| `/Home/Error` | HomeController | Error | `Views/Shared/Error.cshtml` |
| `/games` | GameController | Index | `Views/Game/Index.cshtml` |
| `/Game/Index` | GameController | Index | `Views/Game/Index.cshtml` |
| `/games/{id}` | GameController | Details (`entity=game`) | `Views/Game/Details.cshtml` |
| `/categories/{id}` | GameController | Details (`entity=category`) | `Views/Game/Details.cshtml` |
| `/publishers/{id}` | GameController | Details (`entity=publisher`) | `Views/Game/Details.cshtml` |
| `/users/{id}` | GameController | Details (`entity=user`) | `Views/Game/Details.cshtml` |
| `/events/{id}` | GameController | Details (`entity=event`) | `Views/Game/Details.cshtml` |
| `/reviews/{id}` | GameController | Details (`entity=review`) | `Views/Game/Details.cshtml` |
| `/Game/Details/{id}?entity=game` | GameController | Details (`entity=game`) | `Views/Game/Details.cshtml` |
| `/Game/Details/{id}?entity=category` | GameController | Details (`entity=category`) | `Views/Game/Details.cshtml` |
| `/Game/Details/{id}?entity=gametype` | GameController | Details (`entity=gametype`) | `Views/Game/Details.cshtml` |
| `/Game/Details/{id}?entity=publisher` | GameController | Details (`entity=publisher`) | `Views/Game/Details.cshtml` |
| `/Game/Details/{id}?entity=user` | GameController | Details (`entity=user`) | `Views/Game/Details.cshtml` |
| `/Game/Details/{id}?entity=review` | GameController | Details (`entity=review`) | `Views/Game/Details.cshtml` |
| `/Game/Details/{id}?entity=event` | GameController | Details (`entity=event`) | `Views/Game/Details.cshtml` |

## Napomene

- URL-ovi `/games/{id}`, `/categories/{id}`, `/publishers/{id}`, `/users/{id}`, `/events/{id}`, `/reviews/{id}` su custom rute koje mapiraju na istu akciju `GameController.Details` uz različit `entity` default.
- `gametype` trenutno nema zasebnu custom rutu, ali je dostupan kroz default konvencionalnu rutu s query parametrom: `/Game/Details/{id}?entity=gametype`.
- Ako zapis za zadani `id` ne postoji, `GameController.Details` vraća 404 (`NotFound`) umjesto viewa.
- U produkciji se globalni exception handler preusmjerava na `/Home/Error`.
