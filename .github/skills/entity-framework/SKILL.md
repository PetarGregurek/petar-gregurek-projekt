---
name: entity-framework
description: "Entity Framework Core skill za BoardGameReviews projekt. Koristi za: dodavanje novog modela/klase, izmjenu postojećeg EF modela, dodavanje anotacija ([Key], [Required], [ForeignKey], itd.), konfiguraciju relacija u OnModelCreating, dodavanje DbSet-a u AppDbContext, generiranje EF migracija (migrations add), primjenu migracija (database update), dodavanje ili izmjenu seed podataka (HasData). NE KORISTI ZA: opće C# pitanja, Razor view izmjene, routing konfiguraciju."
argument-hint: "Opis izmjene — npr. 'dodaj model Tag s vezom na Game' ili 'dodaj migraciju za novo polje'"
---

# Entity Framework Core — BoardGameReviews

## Kada koristiti ovaj skill

- Dodavanje novog entiteta/tablice u model
- Izmjena postojeće klase (novo polje, promijenjena anotacija, nova veza)
- Konfiguracija relacije u `OnModelCreating` (OnDelete, FK, navigacijska svojstva)
- Generiranje i primjena EF migracija
- Izmjena seed podataka (`HasData`)

## Projektna konvencija

Sve EF klase, DbContext, interfejs i repozitorij se nalaze u:

```
BoardGameReviews/
├── Models/           ← entiteti (POCO klase)
├── Data/
│   ├── AppDbContext.cs           ← DbContext + OnModelCreating + HasData
│   ├── IBoardGameRepository.cs   ← interfejs repozitorija
│   └── EfBoardGameRepository.cs  ← EF implementacija
└── Migrations/       ← generirane migracije (ne dirati ručno)
```

## Procedure

### 1. Dodavanje novog modela

1. Kreiraj klasu u `BoardGameReviews/Models/NoviModel.cs`
2. Dodaj EF anotacije prema [konvencijama](./references/ef-conventions.md)
3. Dodaj `virtual` navigacijska svojstva i `virtual ICollection<>` kolekcije
4. Dodaj `DbSet<NoviModel> NoviModeli { get; set; }` u `AppDbContext`
5. Konfiguriraj relacije u `OnModelCreating` ako treba custom `OnDelete`
6. Ako treba seed: dodaj `HasData(...)` u `OnModelCreating`
7. Dodaj metode u `IBoardGameRepository` i `EfBoardGameRepository`
8. [Generiraj migraciju](#3-generiranje-migracije)

### 2. Izmjena postojećeg modela

1. Uredi klasu u `Models/`
2. Ako je promjena FK/relacije: ažuriraj `OnModelCreating` u `AppDbContext`
3. Ako se mijenjaju seed podaci: ažuriraj odgovarajući `HasData` blok
4. [Generiraj migraciju](#3-generiranje-migracije)

### 3. Generiranje migracije

```powershell
cd BoardGameReviews

# Generiraj novu migraciju
dotnet ef migrations add ImeMigracije

# Provjeri sadržaj generirane migracije u Migrations/
# Primijeni na lokalnu bazu
dotnet ef database update
```

> Za Docker: samo pokreni `docker compose up --build` — `database update` se pokreće automatski pri startu app containera.

### 4. Uklanjanje migracije (ako je pogrešna, još nije primijenjena)

```powershell
dotnet ef migrations remove
```

## Važne napomene

- `HasData` zahtijeva **fiksne vrijednosti** — ne koristiti `DateTime.Now`, `Guid.NewGuid()` niti random generator
- FK navigacijska svojstva moraju biti `virtual` (omogućuje lazy loading i EF proxy)
- `ICollection<>` kolekcije inicijalizirati s `new HashSet<>()`
- `OnDelete` pravila za ovaj projekt: vidi [ef-conventions.md](./references/ef-conventions.md)
- Migracije u `Migrations/` se **ne uređuju ručno** — uvijek kroz `dotnet ef`
