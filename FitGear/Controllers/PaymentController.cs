using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FitGear.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FitGear.Data;
using FitGear.Models.Payment;
using Microsoft.AspNetCore.Authorization;

namespace FitGear.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }
        
        // GET: api/Payment/user/5
        [HttpGet("user/{userId}")]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<ActionResult<IEnumerable<GetPaymentDto>>> GetPaymentsByUserId(string userId)
        {
            var payments = await _paymentService.GetUserPaymentsAsync(userId);
            return Ok(payments);
        }

        // GET: api/Payment/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<ActionResult<GetPaymentDto>> GetPayment(int id)
        {
            var payment = await _paymentService.GetPaymentAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // POST: api/Payment
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Payment>> PostPayment(CreatePaymentDto createPaymentDto)
        {
            var payment = await _paymentService.CreatePaymentAsync(createPaymentDto);
            if (payment == null)
            {
                NotFound(new {message = "Booking not found"});
            }
            
            return CreatedAtAction("GetPayment", new { id = payment.Id }, payment);
        }
        
        // PUT: api/Payment/5/process
        [HttpPut("{id}/process")]
        [Authorize]
        public async Task<ActionResult<Payment>> ProcessPayment(int id)
        {
            var payment = await _paymentService.ProcessPaymentAsync(id);
            if (payment == null)
            {
                return NotFound(new { message = "Payment not found" });
            }

            return Ok(payment);
        }

        // DELETE: api/Payment/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator, Moderator")]
        public async Task<IActionResult> RefundPayment(int id)
        {
            var payment = await _paymentService.RefundPaymentAsync(id);
            if (payment == null)
            {
                return NotFound();
            }
            
            return NoContent();
        }
        
        // DELETE api/Payment/5/delete
        // Ендпоинт для удаления платежа и бронирования(будет использован если пользователь уже перешел на форму оплаты, но решил с нее уйти)
        [HttpDelete("{paymentId}/delete")]
        [Authorize]
        public async Task<IActionResult> DeletePayment(int paymentId)
        {
            var payment = await _paymentService.GetPaymentAsync(paymentId);
            if (payment == null) 
            {
                return NotFound(new {messgae = "Payment not found"});
            }
            
            await _paymentService.DeletePaymentAndBookingAsync(paymentId);
            
            return NoContent();
        }
    }
}
