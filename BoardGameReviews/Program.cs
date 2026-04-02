using BoardGameReviews.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();


var categories = SampleData.Categories;
var gameTypes = SampleData.GameTypes;
var publishers = SampleData.Publishers;
var games = SampleData.Games;
var users = SampleData.Users;
var reviews = SampleData.Reviews;
var events = SampleData.Events;


builder.Services.AddSingleton(categories);
builder.Services.AddSingleton(gameTypes);
builder.Services.AddSingleton(publishers);
builder.Services.AddSingleton(games);
builder.Services.AddSingleton(users);
builder.Services.AddSingleton(reviews);
builder.Services.AddSingleton(events);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
