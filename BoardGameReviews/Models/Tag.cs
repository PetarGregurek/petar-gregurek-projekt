using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BoardGameReviews.Models
{
    // Example EF entity that is part of the DB model but not used in UI/controllers.
    public class Tag
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(80)]
        public string Name { get; set; } = string.Empty;

        [StringLength(250)]
        public string? Description { get; set; }

        public virtual ICollection<Game> Games { get; set; } = new HashSet<Game>();
    }
}
