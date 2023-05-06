using Microsoft.AspNetCore.Mvc;

namespace CafeHUBWebV2.Controllers;

public class CafeManagement : Controller
{
    // GET
    public IActionResult Index()
    {
        return View();
    }
    public IActionResult Customers()
    {
        return View("Customers");
    }
    public IActionResult Payment()
    {
        return View("Payment");
    }
    public IActionResult Products()
    {
        return View("Products");
    }
}