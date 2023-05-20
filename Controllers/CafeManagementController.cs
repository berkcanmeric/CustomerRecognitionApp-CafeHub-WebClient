using Microsoft.AspNetCore.Mvc;

namespace CafeHUBWebV2.Controllers
{
    public class CafeManagementController : Controller
    {
        // GET: /CafeManagement/Index
        public IActionResult Index()
        {
            return View();
        }

        // GET: /CafeManagement/Customers
        public IActionResult Customers()
        {
            return View("Customers");
        }

        // GET: /CafeManagement/Payment/{userId}
        [HttpGet("/CafeManagement/Payment")]
        public IActionResult Payment(string userId)
        {
            return View("Payment", userId);
        }


        // GET: /CafeManagement/Payment/Verification
        [HttpGet("/CafeManagement/Payment/Verification")]
        public IActionResult Verification()
        {
            return View("PaymentVerification");
        }

        // GET: /CafeManagement/Products
        public IActionResult Products()
        {
            return View("Products");
        }
        
    }
}