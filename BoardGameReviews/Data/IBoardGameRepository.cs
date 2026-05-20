using BoardGameReviews.Models;

namespace BoardGameReviews.Data
{
    public interface IBoardGameRepository
    {
        // ── Collections (index) ─────────────────────────────────────────────
        Task<List<Game>>      GetAllGamesAsync();
        Task<List<Game>>      SearchGamesAsync(string? query, int take = 0);
        Task<List<Category>>  GetAllCategoriesAsync();
        Task<List<GameType>>  GetAllGameTypesAsync();
        Task<List<Publisher>> GetAllPublishersAsync();
        Task<List<User>>      GetAllUsersAsync();
        Task<List<Review>>    GetAllReviewsAsync();
        Task<List<Event>>     GetAllEventsAsync();
        Task<List<Category>>  SearchCategoriesAsync(string? query, int take = 0);
        Task<List<GameType>>  SearchGameTypesAsync(string? query, int take = 0);
        Task<List<Publisher>> SearchPublishersAsync(string? query, int take = 0);
        Task<List<User>>      SearchUsersAsync(string? query, int take = 0);

        // ── Detail lookups ───────────────────────────────────────────────────
        Task<Game?>      GetGameWithDetailsAsync(int id);
        Task<Game?>      GetGameForEditAsync(int id);
        Task<Category?>  GetCategoryWithGamesAsync(int id);
        Task<GameType?>  GetGameTypeWithGamesAsync(int id);
        Task<Publisher?> GetPublisherWithGamesAsync(int id);
        Task<User?>      GetUserWithReviewsAsync(int id);
        Task<Review?>    GetReviewWithDetailsAsync(int id);
        Task<Event?>     GetEventWithGameAsync(int id);

        // ── Game mutations ────────────────────────────────────────────────────
        Task AddGameAsync(Game game);
        Task UpdateGameAsync(Game game);
        Task DeleteGameAsync(Game game);
        Task<bool> CanDeleteGameAsync(int id);

        // ── Category mutations ────────────────────────────────────────────────
        Task AddCategoryAsync(Category category);
        Task UpdateCategoryAsync(Category category);
        Task DeleteCategoryAsync(Category category);
        Task<bool> CanDeleteCategoryAsync(int id);

        // ── Event mutations ───────────────────────────────────────────────────
        Task AddEventAsync(Event evt);
        Task UpdateEventAsync(Event evt);
        Task DeleteEventAsync(Event evt);

        // ── GameType mutations ────────────────────────────────────────────────
        Task AddGameTypeAsync(GameType gameType);
        Task UpdateGameTypeAsync(GameType gameType);
        Task DeleteGameTypeAsync(GameType gameType);
        Task<bool> CanDeleteGameTypeAsync(int id);

        // ── Publisher mutations ───────────────────────────────────────────────
        Task AddPublisherAsync(Publisher publisher);
        Task UpdatePublisherAsync(Publisher publisher);
        Task DeletePublisherAsync(Publisher publisher);
        Task<bool> CanDeletePublisherAsync(int id);

        // ── Review mutations ──────────────────────────────────────────────────
        Task AddReviewAsync(Review review);
        Task UpdateReviewAsync(Review review);
        Task DeleteReviewAsync(Review review);

        // ── User mutations ────────────────────────────────────────────────────
        Task AddUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(User user);
        Task<bool> CanDeleteUserAsync(int id);

        // ── Home page ────────────────────────────────────────────────────────
        Task<int> CountGamesAsync();
        Task<int> CountReviewsAsync();
        Task<int> CountUsersAsync();
        Task<int> CountEventsAsync();
        Task<List<Game>>     GetTopRatedGamesAsync(int count);
        Task<List<Event>>    GetUpcomingEventsAsync(int count);
        Task<List<Category>> GetPopularCategoriesAsync(int count);
    }
}
