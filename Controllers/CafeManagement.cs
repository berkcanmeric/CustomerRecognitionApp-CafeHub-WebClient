using Microsoft.AspNetCore.Mvc;

namespace CafeHUBWebV2.Controllers;

public class CafeManagement : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
}