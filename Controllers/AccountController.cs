using Microsoft.AspNetCore.Mvc;

namespace CafeHUBWebV2.Controllers;

public class AccountController : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
    // GET
    public IActionResult ResetPassword()
    {
        return View();
    }
}
