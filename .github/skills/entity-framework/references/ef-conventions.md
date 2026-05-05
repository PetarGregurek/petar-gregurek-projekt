# EF Core konvencije — BoardGameReviews

## Anotacije po uzorku

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Entitet
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(120)]
    public string Name { get; set; } = string.Empty;

    // Opcionalna svojstva
    [StringLength(500)]
    public string? Description { get; set; }

    // Numerički raspon
    [Range(1, 100)]
    public int Broj { get; set; }

    // FK + navigacija
    public int DrugaKlasaId { get; set; }
    [ForeignKey(nameof(DrugaKlasaId))]
    public virtual DrugaKlasa? DrugaKlasa { get; set; }

    // Inverzna kolekcija
    public virtual ICollection<DijeteKlasa> Djeca { get; set; } = new HashSet<DijeteKlasa>();
}
```

## OnDelete pravila u ovom projektu

| Veza | OnDelete | Razlog |
|---|---|---|
| Game → Category | Restrict | Čuvamo kategoriju ako postoje igre |
| Game → GameType | Restrict | Čuvamo tip ako postoje igre |
| Game → Publisher | Restrict | Čuvamo izdavača ako postoje igre |
| Review → Game | Restrict | Izbjegavamo kaskadni konflikt (Review ima dva FK) |
| Review → User | Cascade | Brisanjem korisnika brišu se i njegove recenzije |
| Event → Game | Cascade | Brisanjem igre brišu se i svi njeni eventi |

## HasData — pravila za seed

```csharp
modelBuilder.Entity<Entitet>().HasData(
    new Entitet
    {
        Id = 1,                               // obavezno, fiksna vrijednost
        Name = "Naziv",
        CreatedAt = new DateTime(2026, 1, 1), // fiksni datum, NE DateTime.Now
        // Ne unositi navigacijska svojstva — samo skalarna polja i FK int-ove
    }
);
```

## DbSet u AppDbContext

```csharp
public DbSet<NoviModel> NoviModeli { get; set; }
```

Naziv DbSet-a je uvijek množina naziva klase.

## Provjera ispravnosti prije migracije

```powershell
dotnet build
dotnet ef migrations add ImeNoveMigracije
# Provjeri Up()/Down() metode u generiranoj datoteci
dotnet ef database update
```

## Tipične greške

| Greška | Uzrok | Rješenje |
|---|---|---|
| `DateTime cannot be used as constant` | `DateTime.Now` u HasData | Zamijeni fiksnim datumom `new DateTime(yyyy,mm,dd)` |
| Multiple cascade paths | Dva FK na istu tablicu s Cascade | Jedan ostavi Cascade, drugi postavi na Restrict |
| Navigation property not virtual | Lazy loading ne radi | Dodaj `virtual` ključnu riječ |
| Model snapshot mismatch | Ručno uređivana migracija | Pokreni `ef migrations remove` i regeneriraj |
