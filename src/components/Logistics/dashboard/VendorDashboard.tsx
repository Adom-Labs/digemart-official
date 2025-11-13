export function VendorDashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Vendor Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Shipment Management</h3>
          <p>View and manage ongoing shipments.</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Delivery Tracking</h3>
          <p>Track the status of deliveries in real-time.</p>
        </div>
        <div className="border p-4 rounded-lg">
          <h3 className="font-semibold">Logistics History</h3>
          <p>View a history of all past shipments.</p>
        </div>
      </div>
    </div>
  );
}
