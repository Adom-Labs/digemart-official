export function BuyerDashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Buyer Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Order Tracking</h3>
          <p>Track your orders in real-time.</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Delivery Address</h3>
          <p>Manage your delivery addresses.</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Order History</h3>
          <p>View your past orders.</p>
        </div>
      </div>
    </div>
  );
}
